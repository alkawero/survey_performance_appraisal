<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use \App\helpers\DatabaseHelperx;

class PaAssessment extends Model
{
    protected $connection   = 'mysql';
    protected $table        = 'pa_assessments';

    public function master(){
        return $this->belongsTo('App\PaMaster','pa_master_id');
    }

    public function assessmentUsers(){
        return $this->hasMany('App\PaAssessmentUser;', 'assessment_id');
    }


}
