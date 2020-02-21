<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PaAspekDetailer extends Model
{
    protected $table = "aspek_detailers";

    public function subAspeks(){
        return $this->hasMany('App\PaSubAspek', 'aspek_id');
    }
}
