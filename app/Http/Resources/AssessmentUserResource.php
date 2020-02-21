<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\PaAssessmentUser;
use \Datetime;

class AssessmentUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $assessment = $this->assessment()->first();
        $master = $assessment->master()->first();
        $participant = $this->participant()->first();
        $total_score = 0;

        $expired = false;
        $started = false;
        $today_midnite = new DateTime('midnight');
        $today = new DateTime();

        if($today_midnite > new DateTime($master->valid_until)) {
            $expired = true;
        }
        if ($today > new DateTime($master->valid_from)) {
            $started = true;
        }


        $total_score = $this->total_score;

        $status_value = "waiting";

        if($expired===true){
            $status_value = "expired";
        }else if($assessment->status===0){
            $status_value = "inactive";
        }else if($this->fill_by_atasan===1 && $this->fill_by_staff===1){
            $status_value = "finish";
        }else if($this->fill_by_atasan===1){
            $status_value = "complete by leader";
        }else if($this->fill_by_staff===1){
            $status_value = "complete by staff";
        }else if($started===true){
            $status_value = "started";
        }

        return [
            'id' => $this->id,
            'master_id'=>$master->id,
            'owner'=>$participant->emp_id,
            'owner_name'=>$participant->emp_name,
            'atasan_id'=>$this->atasan_id,
            'master_name'=>$master->name,
            'valid_from'=>$master->valid_from,
            'valid_until'=>$master->valid_until,
            'total_score'=>number_format($total_score,2),
            'score_category'=>$this->getCategory($total_score),
            'status_code'=>$assessment->status,
            'status_value'=>$status_value,
            'active'=>$assessment->status,
            'fill_by_staff'=>$this->fill_by_staff,
            'fill_by_atasan'=>$this->fill_by_atasan,
            'approval_atasan'=>$this->approval_atasan,
            'approval_staff'=>$this->approval_staff

        ];
    }

    private function getCategory($score){
        if($score > 3.5){
            return "A";
        }elseif($score > 3){
            return "B";
        }elseif($score > 2.5){
            return "C";
        }else{
            return "D";
        }
    }
}
