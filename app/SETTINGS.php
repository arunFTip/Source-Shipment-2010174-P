<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SETTINGS extends Model
{
		protected $table="settings";
    	protected $primaryKey="SID";
    	protected $fillable = [
            'Name',
    		'Value'
		];
        protected $hidden = [
        'created_at', 'updated_at'
        ];
}