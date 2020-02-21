<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSurveyTrxUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('survey_trx_users', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('survey_trx_id');
            $table->integer('emp_owner_id');
            $table->integer('unit_owner_id');
            $table->integer('surveyor_emp_id');
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
        Schema::dropIfExists('survey_trx_users');
    }
}
