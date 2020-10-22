<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePackingdetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('packingdetails', function (Blueprint $table) {
            $table->increments('PDID');
            $table->integer('PAID');
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
        Schema::drop('packingdetails');
    }
}
