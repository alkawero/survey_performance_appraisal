<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaMastersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pa_masters', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('periode');
            $table->tinyInteger('semester');
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
        Schema::dropIfExists('pa_masters');
    }
}
