<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaUnsursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pa_unsurs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('sub_aspek_id');
            $table->char('code',7);
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
        Schema::dropIfExists('pa_unsurs');
    }
}
