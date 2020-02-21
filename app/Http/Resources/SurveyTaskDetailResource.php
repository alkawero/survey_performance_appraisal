<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SurveyTaskDetailResource extends JsonResource
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
        $groups = $survey->question_groups()->get();
        $allquestion = array();
        foreach($groups as $group){
            $allquestion = array_merge($allquestion, $group->questions()->where('active',1)->get()->load('options')->toArray());
        }
        return [
            'trx_user_id' => $this->id,
            'judul' => $survey->judul,
            'description' => $survey->description,
            'valid_from' => $trx->valid_from,
            'valid_until' => $trx->valid_until,
            'active'    => $trx->active,
            'owner_type'=> $trx->owner_type,
            'owner_name'=> $trx->owner_type==='P'?$this->employeeOwner()->select('emp_name')->first()->emp_name : $this->unitowner()->first()->unit_name,
            'questions' => $allquestion
        ];

    }
}
