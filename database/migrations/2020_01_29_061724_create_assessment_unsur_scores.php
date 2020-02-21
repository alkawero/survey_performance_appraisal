<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAssessmentUnsurScores extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('assessment_unsur_scores', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('assessment_users_id');
            $table->integer('unsur_id');
            $table->integer('atasan_score');
            $table->integer('staff_score');
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
        Schema::dropIfExists('assessment_unsur_scores');
    }
}
