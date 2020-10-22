<?php

namespace App;

use Illuminate\Database\Eloquent\Model,Auth;

class PROFORMA_DETAILS extends Model
{
        protected $table="proformadetails";
        protected $primaryKey="PRDID";
        protected $fillable = [
            'id',
            'PRID',
            'ITID',
            'HSN',
            'IName',
            'Rate',
            'GST',
            'RCGST',
            'CGST',
            'RSGST',
            'SGST',
            'RIGST',
            'IGST',
            'Amount',
            'Total',
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