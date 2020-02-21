<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubAspekScores extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sub_aspek_scores', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('assessment_users_id');
            $table->integer('sub_aspek_id');
            $table->decimal('score', 3, 2);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sub_aspek_scores');
    }
}
