<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PaUnsur extends Model
{
    public function sub_aspek()
    {
        return $this->belongsTo('App\PaSubAspek', 'sub_aspek_id');
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
