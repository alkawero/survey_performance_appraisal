<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SurveyTrxAnswer extends Model
{
    protected $fillable = ['text','code','score','survey_trx_user_id','question_id'];

    public function survey_trx()
    {
        return $this->belongsTo(SurveyTrx::class);
    }

    public function question(){
        return $this->hasOne('App\Question', 'id', 'question_id')->select('id','question','type');
    }


}
