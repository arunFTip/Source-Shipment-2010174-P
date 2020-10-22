<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDcdetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dcdetails', function (Blueprint $table) {
            $table->increments('DDID');
            $table->integer('DCID');
            $table->string('Particulars');            
            $table->integer('Box');
            $table->integer('Meter');
            $table->string('Remarks');
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
        Schema::drop('dcdetails');
    }
}
