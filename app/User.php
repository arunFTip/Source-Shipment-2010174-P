<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable,Auth;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password','Mobile','UserName','CName','Logo','Driver','Host','Port','From','SenderName',
        'Encryption','MPassword','Due','InvType','InvFrom','InvThr','InvTy'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token','MPassword'
    ];

        // public function save(array $options = array())
        // {
        //     if(!$this->comid)
        //     {
        //         $this->comid = Auth::user()->comid;
        //     }
        //     parent::save($options);
        // }

        // public function newQuery($excludeDeleted = true) {
        //     return parent::newQuery($excludeDeleted)
        //         ->where('comid', Auth::user()->comid);
        // }
}
