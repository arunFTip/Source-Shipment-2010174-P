<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\HSN,Auth,App\INVOICE,App\PAYMENT,App\User;

class HsnController extends Controller
{
	public function index()
	{
		$data=HSN::all();
		return response($data);
	}

	public function show($id)
	{		
		$gst=HSN::groupBy('GST')->get();
		$hsn=HSN::all();
		return response(['gst'=>$gst,'hsn'=>$hsn]);
	}

	public function store(Request $request)
	{	
		$this->validate($request,
            ['HSN'=>'unique:hsn,HSN']);

		$input=$request->all();
		$data=HSN::create($input);
		return response($data);
	}

	public function update(Request $request,$id)
	{
		$this->validate($request,
            ['HSN'=>"unique:hsn,HSN,$id,HID"]);
		$input=$request->all();
		$data=HSN::find($id);
		$data->update($input);
		return response($data);
	}

	public function destroy($id)
	{
		$data=HSN::find($id);
		$data->delete();
	}

}