<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAssessmentUser5 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('assessments_users', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('assessment_id');
            $table->string('participant_id',11);
            $table->string('atasan_id',11);
            $table->tinyInteger('fill_by_staff');
            $table->tinyInteger('fill_by_atasan');
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
        Schema::dropIfExists('assessment_user5');
    }
}
