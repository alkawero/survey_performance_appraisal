<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterDeletionAllTableWithUpdate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->boolean('active');           
        });

        Schema::table('question_groups', function (Blueprint $table) {
            $table->boolean('active');           
        });

        Schema::table('question_options', function (Blueprint $table) {
            $table->boolean('active');           
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
