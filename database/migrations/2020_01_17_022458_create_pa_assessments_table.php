<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaAssessmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pa_assessments', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('pa_master_id');
            $table->string('user_id',11);
            $table->string('atasan_id',11);
            $table->string('created_by',11);
            $table->string('updated_by',11)->nullable();
            $table->string('deleted_by',11)->nullable();
            $table->decimal('total_score', 2, 2);
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
        Schema::dropIfExists('pa_assessments');
    }
}
