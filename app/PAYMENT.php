<?php

namespace App;

use Illuminate\Database\Eloquent\Model,Auth;

class PAYMENT extends Model
{
		protected $table="payment";
    	protected $primaryKey="PID";
    	protected $fillable = [
            'IID',
            'id',
            'comid',
            'Date',
            'Bank',
            'Cheque',
            'ChequeNo',
            'Amount',
            'Status',
            'Detail',
		];

        protected $hidden = [
        'comid'
        ];

        public function save(array $options = array())
        {
            if(!$this->id)
            {
                $this->id = Auth::user()->id;
            }
            parent::save($options);
        }

        // public function newQuery($excludeDeleted = true) {
        //     return parent::newQuery($excludeDeleted)
        //         ->where('comid', Auth::user()->comid);
        // }
}