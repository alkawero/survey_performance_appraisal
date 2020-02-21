<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMasterBobotUnsur2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pa_master_bobot_unsur', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('master_id');
            $table->integer('unsur_id');
            $table->integer('bobot');
            $table->integer('bobot_optional');
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
        Schema::dropIfExists('master_bobot_unsur2');
    }
}
