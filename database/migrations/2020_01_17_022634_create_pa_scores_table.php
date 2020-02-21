<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaScoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pa_scores', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('pa_master_id');
            $table->integer('assessment_id');
            $table->integer('unsur_id');
            $table->integer('sub_aspek_id');
            $table->integer('aspek_id');
            $table->string('user_id',11);
            $table->string('atasan_id',11);
            $table->string('created_by',11);
            $table->string('updated_by',11)->nullable();
            $table->tinyInteger('unsur_self_score');
            $table->tinyInteger('unsur_atasan_score');
            $table->tinyInteger('status');
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
        Schema::dropIfExists('pa_scores');
    }
}
