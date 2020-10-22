<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\CUSTOMER,Auth,App\INVOICE,App\PAYMENT,App\DETAILS,DB,App\SETTINGS,App\DC,Mail;
use App\ITEM;
class InvoiceController extends Controller
{
	public function index(Request $request)
	{
		$data=INVOICE::leftJoin('customers', 'customers.CID', '=', 'invoice.CID')
		->where('invoice.id',Auth::id())
		->select('IID','InvNo','Date','Due','invoice.CID','Total','Balance','Status','CName','Mobile1',DB::raw('DATEDIFF(CURDATE(),DATE(from_unixtime(Due))) AS Diff'));

		$filters=$request->filter['filters'][0];

		if(isset($filters['Search'])&&$filters['Search']!='')
		{
			$data->where('CName','LIKE','%'.$filters['Search'].'%')
				 ->orWhere('Cons','LIKE','%'.$filters['Search'].'%')
				 ->orWhere('Sb','LIKE','%'.$filters['Search'].'%')
				 ->orWhere('InNo','LIKE','%'.$filters['Search'].'%')
				 ->orWhere('Awbl','LIKE','%'.$filters['Search'].'%');
		}

		if(isset($filters['FromDate'])&&$filters['FromDate']!='NaN'&&isset($filters['ToDate'])&&$filters['ToDate']!='NaN')
        {
        	$data->whereBetween('Date',[$filters['FromDate'],$filters['ToDate']]);
        }

        $total=count($data->get());
        $data->take($request->take)->skip($request->skip);
        if($request->sort)
        {
        	$data->orderBy($request->sort[0]['field'],$request->sort[0]['dir']);	
        }
        $data=$data->get();
		return response (['data'=>$data,'total'=>$total]);
	}

	public function store(Request $request)
	{
		$user=Auth::user();
		$input=$request->invoice;
		$det=$request->details;

		$input=$request->invoice;
		$input['Status']='Payable';
		if(!isset($input['RID']))
		{
			$inv=INVOICE::where('id',Auth::id())->orderBy('InvNo','DESC')->first();
			if(isset($inv))
			{ $input['InvNo']=$inv->InvNo+1; }
			else
			{ $input['InvNo']=1; }

			$Job=INVOICE::where('InvFrom',$input['InvFrom'])->where('InvTy',$input['InvTy'])->orderBy('Job','DESC')->first();
			if(isset($Job))
			{ $input['Job']=$inv->Job+1; }
			else
			{ $input['Job']=1; }
		}
		else
		{
			$inv2=INVOICE::find($input['RID']);
			if($inv2->Status=='Cancelled')
			{
				$inv2->update(['Status'=>'Regen']);
				$input['InvNo']=$inv2->InvNo;
			}
			else
			{
				return response('Cant Generate ',422);
			}
		}
		

		$data=INVOICE::create($input);

		$details=$request->details;
		foreach ($details as $detail) {
			$detail['IID']=$data->IID;

			if(isset($detail['ITID'])){
				$item=ITEM::find($detail['ITID']);
				$item->update(['IName'=>$detail['IName']]);
			}
			else
			{
				$item=ITEM::where('IName',$detail['IName'])->first();
				if(!isset($item))
				{
					ITEM::create(['IName'=>$detail['IName']]);
				}

			}
			DETAILS::create($detail);
		}
		return response($data);
	}

	public function status(Request $request)
	{
		$pay=PAYMENT::where('IID',$request->IID)->first();
		if(isset($pay))
		{
			return response('There is Active Payments. Cant '.$request->Status,422);
		}
		$input=$request->all();
		$data=INVOICE::find($request->IID);
		if($data->Status!='Closed'&&$data->Status!='Regen')
		{
			if($data->Status=="Cancelled")
			{
				$data->update(['Status'=>'Payable']);
			}
			else
			{
				$data->update(['Status'=>'Cancelled']);
			}
		}
		else
		{
			return response('Cant Cancel ',422);
		}
		return response($data);
	}

	public function edit($id)
	{
		$uid=Auth::user();
		$data=INVOICE::leftJoin('customers', 'customers.CID', '=', 'invoice.CID')
		->with('details')->find($id);

		$inv=INVOICE::orderBy('IID','DESC')->first();
		$data['Last']=$inv->IID;
		
		return response($data);
	}

	public function update(Request $request,$id)
	{
		$pay=PAYMENT::where('IID',$id)->first();
		$data=INVOICE::find($id);
		if(isset($pay))
		{
			return response('There is Active Payments. Cant Edit',422);
		}
		if($data->Status!='Payable')
		{
			return response('Cant Edit',422);
		}


		$user=Auth::user();
		$input=$request->invoice;
		$data=INVOICE::find($id);
		$data->update($input);

		DETAILS::where('IID',$id)->delete();
		$details=$request->details;
		foreach ($details as $detail) {
			$detail['IID']=$data->IID;

			if(isset($detail['ITID'])){
				$item=ITEM::find($detail['ITID']);
				if(isset($item))
				{
				$item->update(['IName'=>$detail['IName']]);
				}
			}
			else
			{
				ITEM::create(['IName'=>$detail['IName']]);
			}
			
			DETAILS::create($detail);
		}

		return response($data);
	}

	public function destroy($id)
	{
		$data=INVOICE::find($id);
		$lead=PAYMENT::where('IID',$id)->first();
		if(isset($lead))
		{
			return response(['error'],422);
		}

		$inv=INVOICE::orderBy('IID','DESC')->first();

		if(($data->IID==$inv->IID)||$data->Status=='Regen')
		{
			PAYMENT::where('IID',$id)->delete();
			DETAILS::where('IID',$id)->delete();
			$data->delete();
			return response(['success']);
		}
		return response('Cant Delete',422);
	}

	public function auditor(Request $request)
	{
		$total=INVOICE::selectRaw('SUM(Amount) As Amount,SUM(CGST) As CGST,SUM(SGST) As SGST,SUM(IGST) As IGST,SUM(Total) As Total')
		->whereBetween('Date',[$request->FromDate,$request->ToDate])
		->whereNotIn('Status',['Cancelled','Regen'])
		->where('invoice.id',Auth::id())
		->first();

		$report=INVOICE::leftJoin('customers', 'customers.CID', '=', 'invoice.CID')->select('CName','TIN','Date','InvNo','Amount','CGST','SGST','IGST','Total')
		->whereBetween('Date',[$request->FromDate,$request->ToDate])
		->whereNotIn('Status',['Cancelled','Regen'])
		->where('invoice.id',Auth::id())
		->orderBy('InvNo','asc')
		->get();

		
		$data['Report']=$report;
		$data['From']=$request->FromDate;
		$data['To']=$request->ToDate;
		$data['Amount']=$total->Amount;
		$data['CGST']=$total->CGST;
		$data['SGST']=$total->SGST;
		$data['IGST']=$total->IGST;
		$data['Total']=$total->Total;
		return response($data);
	}

	public function sendinvoice(Request $request)
	{
		$user=Auth::user();

		$data = base64_decode(preg_replace('#^data:application/\w+;base64,#i', '', $request->Pdf));

		file_put_contents('Invoice.pdf', $data);

		$from=$user->email;
		$to=$request->Email;
		$subject=$request->Subject;

		config(['mail.driver' => $user->Driver,
				'mail.host' => $user->Host,
				'mail.port' => $user->Port,
				'mail.encryption' => $user->Encryption,
				'mail.username' => $user->email,
				'mail.password' => $user->MPassword]);


		Mail::queue('layout.template',['data'=>$request->Body],function($message) use ($from,$to,$subject)
         {
            $message->from($from)->to($to)->subject($subject)
            ->attach('Invoice.pdf');
		            
        });

        unlink('Invoice.pdf');

	}


}