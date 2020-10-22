<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDcTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dc', function (Blueprint $table) {
            $table->increments('DCID');
            $table->integer('id');
            $table->integer('Date');
            $table->integer('CID');
            $table->integer('TotBox');
            $table->integer('TotMeters');
            $table->string('Description');
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
        Schema::drop('dc');
    }
}
