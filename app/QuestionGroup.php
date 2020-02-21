<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuestionGroup extends Model
{

    public function surveys()
    {
        return $this->belongsToMany('App\Survey', 'survey_question_group', 'question_group_id', 'survey_id');
    }

    public function questions()
    {
       return $this->hasMany(Question::class);
    }

    public function unit()
    {
       return $this->hasOne(Unit::class);
    }
}
