<?php

namespace App;

use Illuminate\Database\Eloquent\Model,Auth;

class HSN extends Model
{
		protected $table="hsn";
    	protected $primaryKey="HID";
    	protected $fillable = [
            'HSN',
            'GST',
		];
        protected $hidden = [
        'created_at', 'updated_at'
        ];
}