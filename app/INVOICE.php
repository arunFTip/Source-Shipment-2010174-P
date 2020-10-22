<?php

namespace App;

use Illuminate\Database\Eloquent\Model,Auth;

class INVOICE extends Model
{
		protected $table="invoice";
    	protected $primaryKey="IID";
    	protected $fillable = [
            'id',
            'PRID',
            'InvNo',
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



        public function details()
        {
            return $this->hasMany('App\DETAILS', 'IID','IID');
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