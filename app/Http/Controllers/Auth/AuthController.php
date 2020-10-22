<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;

use Illuminate\Support\Facades\Input;
use Auth,Illuminate\Http\Request,Hash;

class AuthController extends Controller
{

    public function index()
    {
        $data=Auth::user();
        return response($data);
    }

    public function store(Request $request)
    {
        $input=$request->all();
        $id=Auth::id();
        $data=User::find($id);

        $this->validate($request,
            ['UserName'=>"required|unique:users,id,$id",
                'Mobile'=>"required|min:10|max:10"],
             ['UserName.unique'=>'The UserName already been Taken.',
             'Mobile.min'=>'Please Enter valid Mobile No',
             'Mobile.max'=>'Please Enter valid Mobile No'
             ]);
        if($request->has('Password'))
        {
            $this->validate($request,
            ['Password'=>'required|min:6|same:RPassword'],
            ['Password.min'=>'Minimum Length is 6','Password.same'=>'Must be same as Retype Password']);
            $input['password']=Hash::make($request->Password);
        }
        if($request->has('MPassword'))
        {
            $this->validate($request,
            ['MPassword'=>'required|min:6|same:RMPassword'],
            ['MPassword.min'=>'Minimum Length is 6','MPassword.same'=>'Must be same as Retype Password']);
        }

        $input['InvType'] = json_encode($request->InvType);
        $input['InvTy'] = json_encode($request->InvTy);
        $input['InvThr'] = json_encode($request->InvThr);
        $input['InvFrom'] = json_encode($request->InvFrom);
        $data->update($input);
        return response($input);
    }



    public function getlogin()
    {
        // dd(Hash::make('123456'));
        if(!Auth::user())
        {
            return view('login');
        }
        return view('welcome');
    }

    public function postlogin(Request $request)
    {
        $this->validate($request,
            ['email'=>'required|exists:users,UserName'],
            ['email.exists'=>'Invalid username']);

        $email      = Input::get('email');
        $password   = Input::get('password');
        $remember   = Input::get('remember');
        if (Auth::attempt(['UserName' => $email, 'password' => $password], $remember == 1 ? true : false))
        {
            return response(['success']);
        }
        return response(['password'=>'Invalid password'], 422);
    }


}