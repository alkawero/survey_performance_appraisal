<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $connection = 'mysql_hris';
    protected $table = 'msunit';
    protected $primaryKey   = 'unit_id';
    public    $incrementing =  false;

    public function surveys()
    {
        return $this->belongsToMany(Survey::class);
    }


}
