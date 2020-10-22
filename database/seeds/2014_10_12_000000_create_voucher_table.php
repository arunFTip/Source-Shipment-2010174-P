<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVoucherTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('voucher', function (Blueprint $table) {
            $table->increments('VID');
            $table->string('PUID');
            $table->string('Date');
            $table->string('Bank');
            $table->string('Cheque');
            $table->string('ChequeNo');
            $table->string('Amount');
            $table->string('Status');
            $table->string('Detail');
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
        Schema::drop('voucher');
    }
}
