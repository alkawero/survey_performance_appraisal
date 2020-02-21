<?php

namespace App\Exports;

use App\PaAssessmentUser;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ScoreExcellExport implements FromCollection,WithHeadings
{
    private $data;

    public function setData($d){
        $this->data = $d;
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        return ["Participant ID", "Participant Name", "Master","Total Score","Final Result"];
    }
}
