<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PaAspek extends Model
{
    public function subAspeks(){
        return $this->hasMany('App\PaSubAspek', 'aspek_id');
    }

    public function master()
    {
        return $this->belongsToMany('App\PaMaster', 'masters_aspeks','aspek_id', 'master_id');
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
