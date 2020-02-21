<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SurveyTrxUser extends Model
{
    //protected $fillable = ['surveyor_emp_id'];
    protected $fillable = ['emp_owner_id','unit_owner_id','surveyor_emp_id'];

    public function surveyTrx()
    {
       return $this->belongsTo('App\SurveyTrx','survey_trx_id');
    }

    public function answers()
    {
       return $this->hasMany('App\SurveyTrxAnswer','survey_trx_user_id');
    }

    public function scoreAnswers()
    {
       return $this->hasMany('App\SurveyTrxAnswer','survey_trx_user_id')->select('score','survey_trx_user_id');
    }

    public function totalScoreByOneSurveyor()
    {
       return $this->hasMany('App\SurveyTrxAnswer','survey_trx_user_id')->select('survey_trx_user_id',DB::raw('CAST(SUM(score) AS UNSIGNED) as total_score'))->groupBy('survey_trx_user_id');
    }

    public function textAnswers()
    {
       return $this->hasMany('App\SurveyTrxAnswer','survey_trx_user_id')->select('text','survey_trx_user_id');
    }

    public function surveyor(){
        return $this->belongsTo('App\User','surveyor_emp_id')->select('emp_id','emp_name');
    }
    public function unitOwner(){
        return $this->belongsTo('App\Unit','unit_owner_id')->select('unit_id','unit_name');
    }
    public function employeeOwner(){
        return $this->belongsTo('App\User','emp_owner_id')->select('emp_id','emp_name');
    }
}
