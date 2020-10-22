<?php

namespace App;

use Illuminate\Database\Eloquent\Model,Auth;

class DC extends Model
{
		protected $table="dc";
    	protected $primaryKey="DCID";
        protected $fillable = [
            'DcNo',
            'id',
            'comid',
            'Date',
            'CID',
            'TotBox',
            'TotMeters',
            'Description',
        ];

        protected $hidden = [
        'comid','created_at', 'updated_at'
        ];

        public function details()
        {
            return $this->hasMany('App\DCDE', 'DCID','DCID');
        }

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