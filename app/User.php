<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    protected $connection   = 'mysql_hris';
    protected $table        = 'msemployee';
    protected $primaryKey   = 'emp_id';
    protected $keyType      = 'string';
    public    $incrementing =  false;

    public function getDB(){
        if(config('app.env')==='LOCAL'){
            $database = env('DB_DATABASE','hris_survey');
        }elseif(config('app.env')==='DEV'){
            $database = env('DB_DATABASE_DEV','hris_survey');
        }elseif(config('app.env')==='PROD'){
            $database = env('DB_DATABASE_PROD','hris_survey');
        }

        return $database;
    }

    public function surveyTasks()
    {
        return $this->belongsToMany('App\SurveyTrx',$this->getDB().'.survey_trx_users','surveyor_emp_id','survey_trx_id');
    }

    public function role(){
        return $this->hasOne('App\Role','emp_id');
    }

    public function subAspeks()
    {
        return $this->belongsToMany('App\PaSubAspek',$this->getDB().'.sub_aspek_to_users','user_id','sub_aspek_id');
    }

}
