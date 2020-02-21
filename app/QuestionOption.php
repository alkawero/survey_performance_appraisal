<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuestionOption extends Model
{
    protected $fillable = ['code','text','question_id'];
    protected $guarded = [];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
