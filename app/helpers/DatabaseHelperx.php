<?php
namespace App\helpers;

class DatabaseHelperx{
    public static function getDB(){

        if(config('app.env')==='LOCAL'){
            $database = env('DB_DATABASE','hris_survey');
        }elseif(config('app.env')==='DEV'){
            $database = env('DB_DATABASE_DEV','hris_survey');
        }elseif(config('app.env')==='PROD'){
            $database = env('DB_DATABASE_PROD','hris_survey');
        }

        return $database;
    }
}


