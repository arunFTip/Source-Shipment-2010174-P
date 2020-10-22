<?php

namespace App;

use Illuminate\Database\Eloquent\Model,Auth;

class ITEM extends Model
{
		protected $table="items";
    	protected $primaryKey="ITID";
    	protected $fillable = [
    		'IName',
            'ICode',
            'HID',
            'IDesc',
            'AQty',
            'SRate',
		];
        protected $hidden = [
        'created_at', 'updated_at'
        ];

        public function hsn()
        {
            return $this->hasOne('App\HSN', 'HID','HID');
        }
}