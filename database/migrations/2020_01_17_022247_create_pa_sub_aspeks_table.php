<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaSubAspeksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pa_sub_aspeks', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('aspek_id');
            $table->char('code',4);
            $table->string('name');
            $table->string('created_by',11);
            $table->string('updated_by',11)->nullable();
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
        Schema::dropIfExists('pa_sub_aspeks');
    }
}
