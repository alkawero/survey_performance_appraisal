<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    public function group()
    {
        return $this->belongsTo(QuestionGroup::class);
    }

    public function options()
    {
       return $this->hasMany('App\QuestionOption')->select(['question_id','code','text']);
    }

    public function answers()
    {        
        return $this->hasMany('App\SurveyTrxAnswer');
    }
}
