<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSupplierTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supplier', function (Blueprint $table) {
            $table->increments('SID');
            $table->string('id');
            $table->string('Name');
            $table->string('CName');
            $table->string('Mobile1');
            $table->string('Mobile2');
            $table->string('TIN');
            $table->string('Email');            
            $table->string('Address1');
            $table->string('Address2');
            $table->string('City');
            $table->string('Pin');
            $table->string('Des');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('supplier');
    }
}
