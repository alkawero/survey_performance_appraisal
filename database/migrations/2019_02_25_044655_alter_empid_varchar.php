<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AlterEmpidVarchar extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
            Schema::table('appraisal_trxes', function($table) {
                $table->string('appraiser_emp_id')->change();          
            });

            Schema::table('appraisal_appraiser', function($table) {
                $table->string('emp_id')->change();          
            });

            Schema::table('appraisal_emp_owner', function($table) {
                $table->string('emp_id')->change();          
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
