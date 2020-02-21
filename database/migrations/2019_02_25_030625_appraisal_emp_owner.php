<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AppraisalEmpOwner extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('appraisal_emp_owner', function (Blueprint $table) {
            $table->increments('id');
        
            $table->integer('appraisal_id')->unsigned()->index();
            $table->foreign('appraisal_id')->references('id')->on('appraisals')->onDelete('cascade');
        
            $table->integer('emp_id')->unsigned()->index();
            $table->foreign('emp_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
