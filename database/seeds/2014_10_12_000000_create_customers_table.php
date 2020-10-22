<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->increments('CID');
            $table->string('Name');
            $table->string('CName');
            $table->string('Mobile1');
            $table->string('Mobile2');
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
        Schema::drop('customers');
    }
}
