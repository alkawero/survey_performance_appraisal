<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{

    protected $connection   = 'mysql';

    public function question_groups()
    {
        return $this->belongsToMany('App\QuestionGroup','survey_question_group')->select('question_groups.id','name');
    }

    

    public function transactions()
    {
        return $this->hasMany('App\SurveyTrx','survey_id');
    }
}
