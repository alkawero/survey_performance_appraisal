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

        Schema::table('survey_unit_owner', function (Blueprint $table) {
            $table->renameColumn('appraisal_id', 'survey_id');
        });
        Schema::table('survey_trxes', function (Blueprint $table) {
            $table->renameColumn('appraiser_emp_id', 'surveyor_emp_id');
            $table->renameColumn('appraisal_id', 'survey_id');
        });
        Schema::table('survey_trx_answers', function (Blueprint $table) {
            $table->renameColumn('appraisal_trx_id', 'survey_trx_id');
        });
        Schema::table('survey_surveyor', function (Blueprint $table) {
            $table->renameColumn('appraisal_id', 'survey_id');
        });

        Schema::table('survey_emp_owner', function (Blueprint $table) {
            $table->renameColumn('appraisal_id', 'survey_id');
        });

        Schema::table('survey_question_group', function (Blueprint $table) {
            $table->dropForeign('appraisal_group_appraisal_id_foreign');
            $table->renameColumn('appraisal_id', 'survey_id');
            $table->foreign('survey_id')->references('id')->on('surveys')->onDelete('cascade');
        });




    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('survey', function (Blueprint $table) {
            //
        });
    }
}
