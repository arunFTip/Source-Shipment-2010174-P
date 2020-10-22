<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\CUSTOMER,Auth,App\INVOICE,App\PAYMENT,App\DETAILS,DB,App\PURCHASE,App\VOUCHER;

class PaymentController extends Controller
{
	public function index(Request $request)
	{
		$data=PAYMENT::select('*')->where('id',Auth::id());

		$filters=$request->filter['filters'];

        foreach ($filters as $filter) {
        	$data->where($filter['field'],$filter['operator'],$filter['value']);
        }

        $total=count($data->get());
        $data = $data->take($request->take)->skip($request->skip)
        ->orderBy($request->sort[0]['field'],$request->sort[0]['dir'])
        ->get();
		return response (['data'=>$data,'total'=>$total]);
	}

	public function show($id)
	{
		$data=INVOICE::leftJoin('customers', 'customers.CID', '=', 'invoice.CID')
		->select('IID','Date','invoice.CID','invoice.id','InvNo','Amount','Balance','Status','City','CName')->find($id);
		return response($data);
	}

	public function edit($id)
	{
		$form=PAYMENT::find($id);

		$data=INVOICE::leftJoin('customers', 'customers.CID', '=', 'invoice.CID')
		->select('IID','Date','invoice.CID','invoice.id','InvNo','Amount','Balance','Status','City','CName')->find($form->IID);
		
		return response(['data'=>$data,'form'=>$form]);
	}

	public function store(Request $request)
	{
		$input=$request->all();
		

		$invoice=INVOICE::find($request->IID);
		$balance=$invoice->Balance-$request->Amount;
		$in['Balance']=$balance;
		$in['id']=Auth::id();
		if($balance==0)
		{
			$in['Status']='Closed';
		}
		if($balance<0)
		{
			return response('Cant Generate ',422);
		}
		$data=PAYMENT::create($input);
		$invoice->update($in);

		return response($data);
	}

	public function update(Request $request,$id)
	{
		$data=PAYMENT::find($id);
		$input=$request->all();
		$invoice=INVOICE::find($data->IID);
		$balance=($invoice->Balance+$data->Amount)-$request->Amount;
		$in['Balance']=$balance;
		if($balance==0)
		{
			$in['Status']='Closed';
		}
		else
		{
			$in['Status']='Open';
		}
		if($balance<0)
		{
			return response('Cant Generate ',422);
		}
		$data->update($input);		
		$invoice->update($in);
		
		return response($data);
	}

	public function report(Request $request)
	{
		$invoice=INVOICE::where('CID',$request->CID)->whereNotIn('Status',['Cancelled','Regen'])->lists('IID','IID');
		$beg1=INVOICE::select(DB::raw('SUM(Total) As Inv'))->whereNotIn('Status',['Cancelled','Regen'])->where('CID',$request->CID)->where('Date','<',$request->FromDate)->first();
		$beg2=PAYMENT::select(DB::raw('SUM(Amount) As Pay'))->whereIn('IID',$invoice)->where('Date','<',$request->FromDate)->first();

		$beg3=INVOICE::select(DB::raw('SUM(Total) As Inv'))
		->whereNotIn('Status',['Cancelled','Regen'])
		->where('CID',$request->CID)
		->whereBetween('Date',[$request->FromDate,$request->ToDate])
		->first();
		$beg4=PAYMENT::select(DB::raw('SUM(Amount) As Pay'))
		->whereIn('IID',$invoice)
		->whereBetween('Date',[$request->FromDate,$request->ToDate])
		->first();

		$report=DB::select("SELECT * FROM (
		(SELECT invoice.Total As Inv, '' AS Rec, invoice.IID, invoice.Date, invoice.InvNo As No, invoice.Status As Status FROM invoice)
		    UNION ALL
		    (SELECT '' AS Inv, payment.Amount As Rec, payment.IID, payment.Date, payment.ChequeNo As No, '' As Status FROM payment)
		) results WHERE IID IN 
   		(SELECT IID FROM invoice WHERE CID = ".$request->CID.") AND Status NOT IN ('Cancelled','Regen') AND Date BETWEEN ".$request->FromDate." AND ".$request->ToDate);

		
		$data=CUSTOMER::select('CID','CName')->find($request->CID);
		$data['Report']=$report;
		$data['Beginning']=$beg1->Inv-$beg2->Pay;
		$data['From']=$request->FromDate;
		$data['To']=$request->ToDate;
		$data['InvTot']=$beg3->Inv;
		$data['RecTot']=$beg4->Pay;
		$data['Closing']=$data['Beginning']+$data['InvTot']-$data['RecTot'];

		// return response($beg3);
		return response($data);
	}

	public function dash()
	{
	
		$today=strtotime('12:00:00');
		$invoice=INVOICE::leftJoin('customers', 'customers.CID', '=', 'invoice.CID')
		->select('IID','InvNo','Date','invoice.CID','invoice.id','Total','Balance','Status','CName')
		->orderBy('IID','DESC')->take(5)->get();
		$invamount=INVOICE::select(DB::raw('SUM(Total) As Amount,SUM(Balance) As Balance'))->first();

		$payment=PAYMENT::leftJoin('invoice', 'invoice.IID', '=', 'payment.IID')->leftJoin('customers', 'customers.CID', '=', 'invoice.CID')
		->select('PID','payment.IID','invoice.CID','CName','InvNo','payment.Date','Cheque','Bank','payment.Amount')
		->orderBy('PID','DESC')->take(5)->get();

		$stat=INVOICE::selectRaw("sum(case when Status = 'Payable' then 1 else 0 end) Payable, sum(case when Status = 'Payable' And DATEDIFF(CURDATE(),DATE(from_unixtime(Due)))>0 then 1 else 0 end) Overdue, count(*) Total")
		->first();

		$report=DB::select("SELECT SUM(Inv) As Invoice, SUM(Rec) As Payment, Date FROM (
		(SELECT SUM(invoice.Total) As Inv, '' AS Rec, Date  FROM invoice GROUP BY YEAR(from_unixtime(Date)), MONTH(from_unixtime(Date)))
		    UNION ALL
		    (SELECT '' AS Inv, SUM(payment.Amount) As Rec, Date FROM payment GROUP BY YEAR(from_unixtime(Date)), MONTH(from_unixtime(Date)))
		) results GROUP BY YEAR(from_unixtime(Date)), MONTH(from_unixtime(Date))");

		// return response (['request'=>$report]);
		return response (['invoice'=>$invoice,'invamount'=>$invamount,'payment'=>$payment,'stat'=>$stat,'report'=>$report]);

	}
}
