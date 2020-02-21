<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\PaAssessmentUser;
use App\User;

class AssessmentByAspekResource extends JsonResource
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
        $participants = PaAssessmentUser::where('assessment_id',$this->id)->get();
        $participant_names = [];
        $size= 0;
        foreach ($participants as $user) {
            $size++;
            $user = User::where("emp_id",$user->participant_id)->value('emp_name');
            array_push($participant_names, $user);
        }

        return [
            'id' => $this->id,
            'employee_names'=>$participant_names,
            'total_participant'=>$size,
        ];
    }
}
