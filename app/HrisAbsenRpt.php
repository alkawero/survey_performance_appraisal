<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HrisAbsenRpt extends Model
{
    protected $connection = 'mysql_hris';
    protected $table = 'tmp_absen_rpt';
    public    $incrementing =  false;

}
