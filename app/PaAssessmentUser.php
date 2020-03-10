<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PaAssessmentUser extends Model
{
    protected $table        = 'assessments_users';

    public function participant(){
        return $this->belongsTo('App\User','participant_id')->select('emp_id','emp_name','unit_id');
    }

    public function atasan(){
        return $this->belongsTo('App\User','atasan_id')->select('emp_id','emp_name');
    }

    public function assessment(){
        return $this->belongsTo('App\PaAssessment','assessment_id');
    }

    public function unsurScores(){
        return $this->hasMany('App\PaAssessmentUnsurScore','assessment_users_id');
    }
}
