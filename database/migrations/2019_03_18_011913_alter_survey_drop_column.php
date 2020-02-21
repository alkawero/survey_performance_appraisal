<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterSurveyDropColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('surveys', function (Blueprint $table) {
            $table->dropColumn('valid_from');
            $table->dropColumn('valid_until');
            $table->dropColumn('type');
            $table->renameColumn('status','active');
        });

        Schema::table('survey_trxes', function (Blueprint $table) {
            $table->dropColumn('saran');
            $table->dropColumn('surveyor_emp_id');
            $table->dropColumn('emp_owner_id');
            $table->dropColumn('unit_owner_id');
            $table->char('active', 1);
            $table->char('owner_type', 1);
            $table->date('valid_from');
            $table->date('valid_until');

        });

        Schema::table('survey_trx_answers', function (Blueprint $table) {
            $table->renameColumn('survey_trx_id','survey_trx_user_id');
            $table->integer('question_id');
            $table->char('code', 1);
            $table->integer('score');
            $table->renameColumn('answer','text');

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
