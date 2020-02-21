<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RefactorToSurvey extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::rename('appraisals', 'surveys');
        Schema::rename('appraisal_appraiser', 'survey_surveyor');
        Schema::rename('appraisal_emp_owner', 'survey_emp_owner');
        Schema::rename('appraisal_unit_owner', 'survey_unit_owner');
        Schema::rename('appraisal_trx_answers', 'survey_trx_answers');
        Schema::rename('appraisal_trxes', 'survey_trxes');
        Schema::rename('appraisal_group', 'survey_question_group');
        Schema::rename('groups', 'question_groups');
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
