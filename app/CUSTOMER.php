<?php

namespace App;

use Illuminate\Database\Eloquent\Model,Auth;

class CUSTOMER extends Model
{
		protected $table="customers";
    	protected $primaryKey="CID";
    	protected $fillable = [
            'id',
    		'Name',
            'CName',
            'TIN',
            'Mobile1',
            'Mobile2',
            'Email',
            'Address',
            'State',
		];
        protected $hidden = [
        'comid','created_at', 'updated_at'
        ];

        public function invoice()
        {
            return $this->hasMany('App\INVOICE', 'CID','CID');
        }

        public function save(array $options = array())
        {
            if(!$this->id)
            {
                $this->id = Auth::user()->id;
            }
            parent::save($options);
        }
}