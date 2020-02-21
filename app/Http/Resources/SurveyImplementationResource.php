<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use App\User;

class SurveyImplementationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $transaction = $this->surveyTrx()->first();
        $survey = $transaction->survey()->first();
        $empOwner = $this->employeeOwner()->first();
        $unitOwner = $this->unitOwner()->first();
        //$surveyors = $transaction->surveyors()->get();
        $trxSurveyors = DB::table('hris_survey.survey_trx_users')
                            ->where('survey_trx_id', $transaction->id)
                            ->pluck('surveyor_emp_id');

        $surveyors = User::select('emp_id','emp_name')
                            ->whereIn('emp_id',$trxSurveyors)
                            ->get();
        return [
            'survey_trx_user_id'=>$this->id,
            'survey_trx_id'=>$transaction->id,
            'valid_from'=>$transaction->valid_from,
            'valid_until'=>$transaction->valid_until,
            'owner_type'=>$transaction->owner_type,
            'emp_owner'=>$empOwner,
            'unit_owner'=>$unitOwner,
            'surveyors'=>$surveyors,
            'active'=>$transaction->active,
            'survey'=>$survey
        ];
    }
}
