<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\PaAssessmentUser;


class AssessmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $master = $this->master()->first();
        $totalParticipant = PaAssessmentUser::where('assessment_id',$this->id)->count();

        return [
            'id' => $this->id,
            'master_id'=>$this->pa_master_id,
            'master_name'=>$master->name,
            'periode'=>$this->periode,
            'semester'=>$this->semester,
            'valid_from'=>$this->valid_from,
            'valid_until'=>$this->valid_until,
            'total_participant'=>$totalParticipant,
            'created_by_id'=> $this->created_by,
            'created_by_name'=> "dummy name",
            'updated_by_id'=>$this->updated_by,
            'updated_by_name'=>"dummy name",
            'status_code'=>$this->status,
            'status_value'=>"dummy status",
            'active'=>$this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
