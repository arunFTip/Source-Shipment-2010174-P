<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePurchaseTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchase', function (Blueprint $table) {
            $table->increments('PUID');
            $table->string('PurNo');
            $table->string('Date');
            $table->string('SID');
            $table->string('TDc');
            $table->string('Qty');
            $table->string('Total');
            $table->string('Vat');
            $table->string('VPer');
            $table->string('Round');
            $table->string('Amount');
            $table->string('Balance');
            $table->string('Status');
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
        Schema::drop('purchase');
    }
}
