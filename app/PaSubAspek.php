<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PaSubAspek extends Model
{
    protected $connection   = 'mysql';

    public function getDB(){
        if(config('app.env')==='LOCAL'){
            $database = env('DB_DATABASE','hris_survey');
        }elseif(config('app.env')==='DEV'){
            $database = env('DB_DATABASE_DEV','hris_survey');
        }elseif(config('app.env')==='PROD'){
            $database = env('DB_DATABASE_PROD','hris_survey');
        }

        return $database;
    }

    public function aspek()
    {
        return $this->belongsTo('App\PaAspek', 'aspek_id');
    }

    public function unsurs(){
        return $this->hasMany('App\PaUnsur', 'sub_aspek_id');
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
