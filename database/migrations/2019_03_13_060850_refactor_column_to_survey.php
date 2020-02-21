<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RefactorColumnToSurvey extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::table('questions', function (Blueprint $table) {
            $table->renameColumn('group_id', 'question_group_id');
        });

        Schema::table('survey_question_group', function (Blueprint $table) {
            $table->dropForeign('appraisal_group_group_id_foreign');
            $table->renameColumn('group_id', 'question_group_id');
            $table->foreign('question_group_id')->references('id')->on('question_groups')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->renameColumn('question_group_id', 'group_id');
        });

        Schema::table('survey_question_group', function (Blueprint $table) {
            $table->renameColumn('question_group_id', 'group_id');
        });
    }
}
