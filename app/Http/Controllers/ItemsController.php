<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\ITEM,Auth,App\INVOICE,App\PAYMENT,App\User;

class ItemsController extends Controller
{
	public function index()
	{
		$data=ITEM::leftJoin('hsn', 'hsn.HID', '=', 'items.HID')->get();
		return response ($data);
	}

	public function store(Request $request)
	{
		$this->validate($request,
            ['HID'=>'required']);		
		$input=$request->all();
		$data=ITEM::create($input);
		$data=ITEM::leftJoin('hsn', 'hsn.HID', '=', 'items.HID')->find($data->ITID);
		return response($data);
	}

	public function update(Request $request,$id)
	{
		$this->validate($request,
            ['HID'=>"required"]);
		$input=$request->all();
		$data=ITEM::find($id);
		$data->update($input);
		$data=ITEM::leftJoin('hsn', 'hsn.HID', '=', 'items.HID')->find($data->ITID);
		return response($data);
	}

	public function destroy($id)
	{
		$data=ITEM::find($id);
		$lead=INVOICE::where('ITID',$id)->first();
		if(isset($lead))
		{
			return response(['error'],422);
		}
		$data->delete();
	}

}