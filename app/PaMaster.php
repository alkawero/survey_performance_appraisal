<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PaMaster extends Model
{

    public function aspeks()
    {
        return $this->belongsToMany('App\PaAspek', 'masters_aspeks', 'master_id', 'aspek_id');
    }

    public function unsurs()
    {
        return $this->belongsToMany('App\PaUnsur', 'pa_master_bobot_unsur', 'master_id', 'unsur_id')->withPivot('bobot');
    }

    public function assessments(){
        return $this->hasMany('App\PaAssessment', 'pa_master_id');
    }

    public function creator()
    {
        return $this->belongsTo('App\User', 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo('App\User', 'updated_by');
    }

}
