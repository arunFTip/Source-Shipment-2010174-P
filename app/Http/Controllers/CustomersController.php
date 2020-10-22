<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\CUSTOMER,Auth,App\INVOICE,App\PAYMENT,App\User;

class CustomersController extends Controller
{
	public function index(Request $request)
	{
		$data=CUSTOMER::select('*')->where('id',Auth::id());

		$filter=$request->filter;
		if(isset($filter['Name'])&&$filter['Name']!='')
        {
            $data->where(function ($query) use ($filter){
			    $query->where('CName','LIKE','%'.$filter['Name'].'%')->orWhere('Mobile1','LIKE','%'.$filter['Name'].'%')->orWhere('Name','LIKE','%'.$filter['Name'].'%');
			});
        }

        $total=count($data->get());
        $data = $data->take($request->take)->skip($request->skip)
        ->orderBy(key((array)($request->orderBy)),current((array)($request->orderBy)))
        ->get();
		return response (['data'=>$data,'total'=>$total]);
	}

	public function store(Request $request)
	{
		$this->validate($request,
            ['TIN'=>'unique:customers,TIN',
            'Mobile1'=>'required|unique:customers,Mobile1,NULL,Mobile2',
            'Mobile2'=>'unique:customers,Mobile1,NULL,Mobile2'],
             ['Mobile1.unique'=>'Number already Taken.','Mobile2.unique'=>'Number already Taken.']);		
		$input=$request->all();
		if(!isset($request->State)||$request->State=='')
		{
			$input['State']=32;
		}
		$data=CUSTOMER::create($input);
		return response($data);
	}

	public function show($id)
	{
		$data=CUSTOMER::select('Name','CName','CID','State')->get();
		return response($data);
	}

	public function edit($id)
	{
		$data=CUSTOMER::find($id);
		return response($data);
	}

	public function update(Request $request,$id)
	{

		$this->validate($request,
            ['TIN'=>"unique:customers,TIN,$id,CID",
            'Mobile1'=>"required|unique:customers,Mobile1,$id,CID",
            'Mobile2'=>"unique:customers,Mobile2,NULL,Mobile2,$id,CID"],
             ['Mobile1.unique'=>'Number already Taken.','Mobile2.unique'=>'Number already Taken.']);

		$input=$request->all();
		$data=CUSTOMER::find($id);
		$data->update($input);
		return response($data);
	}

	public function destroy($id)
	{
		$data=CUSTOMER::find($id);
		$lead=INVOICE::where('CID',$id)->first();
		if(isset($lead))
		{
			return response(['error'],422);
		}
		$data->delete();
	}

}