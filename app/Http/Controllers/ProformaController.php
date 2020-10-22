<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\CUSTOMER,Auth,App\PROFORMA,DB,App\SETTINGS,App\DC,Mail;
use App\PROFORMA_DETAILS;
use App\ITEM, Carbon\Carbon;

class ProformaController extends Controller
{
	public function index(Request $request)
	{
		$data=PROFORMA::leftJoin('customers', 'customers.CID', '=', 'proforma.CID')
		->where('proforma.id',Auth::id())
		->select('PRID','ProNo','Date','Due','InvThr','InvTy','Job' ,'proforma.CID','Total','Balance','Status','CName','Mobile1',DB::raw('DATEDIFF(CURDATE(),DATE(from_unixtime(Due))) AS Diff'));

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
        $total = clone($data);
        $total=$total->count();
        $data->take($request->take)->skip($request->skip);
        if($request->sort)
        {
         	$data->orderByRaw("DATE(from_unixtime(Date)) DESC")->orderBy('PRID','DESC')->orderBy($request->sort[0]['field'],$request->sort[0]['dir']);	
        }
        $data=$data->get();
		return response (['data'=>$data,'total'=>$total]);
	}

	public function store(Request $request)
	{
		$user=Auth::user();
		$input=$request->proforma;
		$input['Status']='Open';
		if(!isset($input['RID']))
		{
			$date = Carbon::createFromTimestamp($input['Date']);
			$d_check = clone($date);
			$from = clone($date);
			$to = clone($date);

			if($d_check->format('m')<=3)
			{
				$from = '01-04-'.$from->addYear(-1)->format('Y');
				$to = '01-04-'.$to->format('Y');
			}
			else{
				$from = '01-04-'.$from->format('Y');
				$to = '01-04-'.$to->addYear(1)->format('Y');
			}
            
			$inv=PROFORMA::whereBetween(DB::raw("DATE(from_unixtime(Date))"),[Carbon::parse($from), Carbon::parse($to)])->where('id',Auth::id())->orderBy('ProNo','DESC')->first();
			
			if(isset($inv))
			{ $input['ProNo']=$inv->ProNo+1; }
			else
			{ $input['ProNo']=1; }

			$Job=PROFORMA::whereBetween(DB::raw("DATE(from_unixtime(Date))"),[Carbon::parse($from), Carbon::parse($to)])->where('InvFrom',$input['InvFrom'])->where('InvTy',$input['InvTy'])->orderBy('Job','DESC')->first();
			
			if(isset($Job))
			{ $input['Job']=$Job->Job+1; }
			else
			{ $input['Job']=1; }
		}
		else
		{
			$inv2=PROFORMA::find($input['RID']);
			if($inv2->Status=='Cancelled')
			{
				$inv2->update(['Status'=>'Regen']);
				$input['ProNo']=$inv2->ProNo;
			}
			else
			{
				return response('Cant Generate ',422);
			}
		}

		$data=PROFORMA::create($input);

		$details=$request->details;
		
		foreach ($details as $detail) {
			$detail['PRID']=$data->PRID;

			if(isset($detail['ITID'])){
				$item=ITEM::find($detail['ITID']);
				$item->update(['IName'=>$detail['IName']]);
			}
			else
			{
				ITEM::create(['IName'=>$detail['IName']]);
			}
			PROFORMA_DETAILS::create($detail);
		}
		return response($data);
	}

	public function status(Request $request)
	{
		$pay=PAYMENT::where('PRID',$request->PRID)->first();
		if(isset($pay))
		{
			return response('There is Active Payments. Cant '.$request->Status,422);
		}
		$input=$request->all();
		$data=PROFORMA::find($request->PRID);
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
		$data=PROFORMA::leftJoin('customers', 'customers.CID', '=', 'proforma.CID')
		->with('proforma_details')->find($id);

		$inv=PROFORMA::orderBy('PRID','DESC')->first();
		$data['Last']=$inv->PRID;
		
		return response($data);
	}

	public function update(Request $request,$id)
	{
		
		$data=PROFORMA::find($id);

		$user=Auth::user();
		$input=$request->proforma;
		$data=PROFORMA::find($id);
		$data->update($input);

		PROFORMA_DETAILS::where('PRID',$id)->delete();
		$details=$request->details;
		foreach ($details as $detail) {
			$detail['PRID']=$data->PRID;

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
			
			PROFORMA_DETAILS::create($detail);
		}

		return response($data);
	}

	public function destroy($id)
	{
		$data=PROFORMA::find($id);

		$inv=PROFORMA::orderBy('PRID','DESC')->first();

		if(($data->PRID==$inv->PRID)||$data->Status=='Regen')
		{
			PROFORMA_DETAILS::where('PRID',$id)->delete();
			$data->delete();
			return response(['success']);
		}
		return response('Cant Delete',422);
	}

	public function proformaauditor(Request $request)
	{
		$total=PROFORMA::selectRaw('SUM(Amount) As Amount,SUM(CGST) As CGST,SUM(SGST) As SGST,SUM(IGST) As IGST,SUM(Total) As Total')
		->whereBetween('Date',[$request->FromDate,$request->ToDate])
		->whereNotIn('Status',['Cancelled','Regen'])
		->where('proforma.id',Auth::id())
		->first();

		$report=PROFORMA::leftJoin('customers', 'customers.CID', '=', 'proforma.CID')->select('CName','TIN','Date','ProNo','Amount','CGST','SGST','IGST','Total')
		->whereBetween('Date',[$request->FromDate,$request->ToDate])
		->whereNotIn('Status',['Cancelled','Regen'])
		->where('proforma.id',Auth::id())
		->orderBy('ProNo','asc')
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

	public function sendproforma(Request $request)
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
	public function details(Request $request)
	{
		$data=PROFORMA::with('proforma_details','customer')
		->whereIn('PRID',explode(',', $request->ids))->first();
		

		return response ($data);
	}


}