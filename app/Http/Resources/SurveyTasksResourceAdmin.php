<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use \Datetime;

class SurveyTasksResourceAdmin extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $trx = $this->surveyTrx()->first();
        $survey = $trx->survey()->first();
        $expired = false;
        $started = false;
        $today_midnite = new DateTime('midnight');
        $today = new DateTime();

        if($today_midnite > new DateTime($trx->valid_until)) {
            $expired = true;
        }  
        if ($today > new DateTime($trx->valid_from)) {
            $started = true;
        } 
        
        return [
            'id' => $this->id,
            'judul'=>$survey->judul,
            'description'=>$survey->description,
            'owner_name'=> $trx->owner_type==='P'?$this->employeeOwner()->select('emp_name')->first()->emp_name : $this->unitowner()->first()->unit_name,
            'valid_from'=>$trx->valid_from,
            'valid_until'=>$trx->valid_until,
            'active' => $trx->active,
            'survey_trx_id'=>$trx->id,
            'expired'=>$expired,
            'started'=>$started,
        ];

    }
}
