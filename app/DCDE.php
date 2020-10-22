<?php

namespace App;

use Illuminate\Database\Eloquent\Model,Auth;

class DCDE extends Model
{
		protected $table="dcdetails";
    	protected $primaryKey="DDID";
    	protected $fillable = [
    		'id',
            'DCID',
            'Particulars',
            'Box',
            'Meter',
            'Remarks',
		];

		public function save(array $options = array())
        {
            if(!$this->id)
            {
                $this->id = Auth::user()->id;
            }
            parent::save($options);
        }
}