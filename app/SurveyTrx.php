<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SurveyTrx extends Model
{
    protected $connection   = 'mysql';

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

    public function surveyors()
    {
        return $this->belongsToMany('App\User',$this->getDB().'.survey_trx_users','survey_trx_id','surveyor_emp_id')->withPivot('id')->select(['emp_id','emp_name']);
    }

    public function empOwners()
    {
       return $this->belongsToMany('App\User',$this->getDB().'.survey_trx_users','survey_trx_id','emp_owner_id')->select(['emp_id','emp_name']);
    }

    public function unitOwners()
    {
        return $this->belongsToMany('App\Unit',$this->getDB().'.survey_trx_users','survey_trx_id','unit_owner_id');
    }

    public function answers()
    {
       return $this->hasManyThrough('App\SurveyTrxAnswer','App\SurveyTrxUser','survey_trx_id','survey_trx_user_id','id','id');
    }

    public function totalScoreForOwner()
    {
       return $this->hasManyThrough('App\SurveyTrxAnswer','App\SurveyTrxUser','survey_trx_id','survey_trx_user_id','id','id')->select('survey_trx_id','score');
    }

    public function survey(){
        return $this->belongsTo('App\Survey','survey_id');
    }

    public function surveyTrxUsers(){
        return $this->hasMany('App\SurveyTrxUser','survey_trx_id');
    }

}
