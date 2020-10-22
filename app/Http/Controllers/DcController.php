<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\CUSTOMER,Auth,App\DC,App\DCDE,DB;

class DcController extends Controller
{
	public function index(Request $request)
	{
		// return response($request->all());
		$data=DC::leftJoin('customers', 'customers.CID', '=', 'dc.CID')
				->select('DCID','DcNo','dc.CID','CName','Mobile1','Date','TotBox','TotMeters','Description')->where('dc.comid', Auth::user()->comid);

		$filters=$request->filter['filters'][0];

		if(!isset($filters['Status'])||$filters['Status']!='Closed')
		{
			$data->whereNotIn('DcNo', 
				function($query) 
				{
					 $query->select('Dc')->from('details')->whereIn('IID',
					 	function($query2) 
					 	{ 
					 		$query2->select('IID')->from('invoice')->where('comid', Auth::user()->comid)->where('Status','!=','Cancelled');
					 	}); 
				});
		}
		if(isset($filters['DcNo'])&&$filters['DcNo']!='')
		{
			$data->where('DcNo','LIKE','%'.$filters['DcNo'].'%');
		}
		if(isset($filters['CID'])&&$filters['CID']!='')
		{
			$data->where('dc.CID',$filters['CID']);
		}
		// if(isset($filters['Status'])&&$filters['Status']!='')
		// {
		// 	$data->where('Status','=',$filters['Status']);			
		// }
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

	public function getdc($id)
	{
		$data=DC::leftJoin('customers', 'customers.CID', '=', 'dc.CID')
		->whereNotIn('DCID', 
				function($query) 
				{
					 $query->select('Dc')->from('details')->whereNotIn('IID',
					 	function($query2) 
					 	{ 
					 		$query2->select('IID')->from('invoice')->where('Status','Cancelled')->orWhere('Status','Regen');
					 	}); 
				})
		->select('DCID','DcNo','dc.CID','CName','Mobile1','Date','TotBox','TotMeters','Description')
		->where('dc.comid', Auth::user()->comid)
		->where('dc.CID',$id)->get();
		return response($data);
	}

	public function store(Request $request)
	{
		$input=$request->invoice;
		$input['id']=Auth::id();

			$inv=DC::where('comid', Auth::user()->comid)->orderBy('DcNo','DESC')->first();
			if(isset($inv))
			{ $input['DcNo']=$inv->DcNo+1; }
			else
			{ $input['DcNo']=1; }

		$data=DC::create($input);

		$details=$request->details;
		foreach ($details as $detail) {
			$detail['DCID']=$data->DCID;
			DCDE::create($detail);
		}
		return response($data);
	}


	public function edit($id)
	{
		$uid=Auth::user();
		$data=DC::leftJoin('customers', 'customers.CID', '=', 'dc.CID')
		->select('DCID','DcNo','dc.CID','CName','TIN','Mobile1','Date','TotBox','TotMeters','Description')
		->with('details')->where('dc.comid',$uid->comid)->find($id);
		$data['Type']=$uid->comid;
		return response($data);
	}

	public function update(Request $request,$id)
	{
		$input=$request->invoice;
		$input['id']=Auth::id();
		$data=DC::find($id);
		$data->update($input);

		DCDE::where('DCID',$id)->delete();
		$details=$request->details;
		foreach ($details as $detail) {
			$detail['DCID']=$data->DCID;
			DCDE::create($detail);
		}

		return response($data);
	}

	public function destroy($id)
	{
		$data=DC::find($id);
		$data->delete();
	}

}