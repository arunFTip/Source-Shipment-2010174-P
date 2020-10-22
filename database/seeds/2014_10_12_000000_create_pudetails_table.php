<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePudetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pudetails', function (Blueprint $table) {
            $table->increments('PDID');
            $table->string('PUID');
            $table->string('PO');
            $table->string('Des');
            $table->string('Qty');
            $table->string('Amount');
            $table->string('Total');
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
        Schema::drop('pudetails');
    }
}
