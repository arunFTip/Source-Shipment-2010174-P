<?php

namespace App;

use Illuminate\Database\Eloquent\Model,Auth;

class PROFORMA extends Model
{
		protected $table="proforma";
    	protected $primaryKey="PRID";
    	protected $fillable = [
            'id',
            'ProNo',
            'Date',
    		'Due',
            'CID',
            // 'Qty',
            'Amount',
            'CGST',
            'SGST',
            'IGST',
            'Round',
            'Total',
            'Balance',
            'Status',
            'Ite',
            'Pac',
            'Fli',
            'Sb',
            'Gr',
            'Cons',
            'Awbl',
            'Dest',
            'InNo',
            'FliNo',
            'InvTy',
            'InvThr',
            'InvFrom',
            'Job',
            'Cbm',
            'ExRt',
		];



        public function proforma_details()
        {
            return $this->hasMany('App\PROFORMA_DETAILS', 'PRID','PRID');
        }
         public function customer()
        {
            return $this->hasOne('App\CUSTOMER', 'CID','CID');
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
        //         ->select('comid')->where('invoice.comid', Auth::user()->comid);
        // }
}