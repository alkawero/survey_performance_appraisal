<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\PaAssessmentUser;
use App\PaAssessmentUnsurScore;
use App\PaSubAspekScore;
use App\PaAspekScore;
use App\PaUnsurToUser;
use App\PaSubAspekToUser;
use App\PaExternalData;
use App\PaUnsur;
use App\Setting;
use App\HrisAbsenRpt;
use App\SurveyTrx;
use App\SurveyTrxUser;
use App\SurveyTrxAnswer;
use Illuminate\Support\Facades\DB;

class DoAssessmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $systemPAStartDate = Setting::where('indicator', 'appraisal_absen_start_date')->value('value');
        $systemPAEndDate = Setting::where('indicator', 'appraisal_absen_end_date')->value('value');
        $assessment = $this->assessment()->first();
        $participant = $this->participant()->first();
        $master = $assessment->master()->first();
        $unsurs = $master->unsurs()->get();
        $aspeks = $master->aspeks()->get();
        $array_aspeks = [];//$aspeks->toArray();
        $array_sub_aspeks = [];
        $array_sub_aspek_custom_ids = [];
        $array_unsurs = [];
        $test = "";
        $subAspekCustomForMe = PaSubAspekToUser::where('user_id',$this->participant_id)->pluck('sub_aspek_id')->toArray();
        foreach ($aspeks as $aspek) {
            $aspekScore = PaAspekScore::where('assessment_users_id',$this->id)
                                            ->where('aspek_id',$aspek->id)->first();
            $aspek->score = $aspekScore!=null ? floatval($aspekScore->score) : 0.0;
            $code_aspek = $aspek->code;
            $sub_aspek_fixed = $aspek->subAspeks()->where('is_custom',0)->get();
            $sub_aspek_custom = $aspek->subAspeks()
                                    ->where('is_custom',1)
                                    ->whereIn('id',$subAspekCustomForMe)
                                    ->get();

            foreach ($sub_aspek_fixed as $sub_aspek) {
                $subAspekScore = PaSubAspekScore::where('assessment_users_id',$this->id)
                                            ->where('sub_aspek_id',$sub_aspek->id)->first();
                $sub_aspek->score = $subAspekScore!=null ? floatval($subAspekScore->score) : 0.0;
                array_push($array_sub_aspeks,$sub_aspek->toArray());
            }

            foreach ($sub_aspek_custom as $sub_aspek) {
                $subAspekScore = PaSubAspekScore::where('assessment_users_id',$this->id)
                                            ->where('sub_aspek_id',$sub_aspek->id)->first();
                $sub_aspek->score = $subAspekScore!=null ? floatval($subAspekScore->score) : 0.0;
                array_push($array_sub_aspeks,$sub_aspek->toArray());
                array_push($array_sub_aspek_custom_ids,$sub_aspek->id);
            }

            array_push($array_aspeks,$aspek->toArray());

        }

        //push fixed unsur
        foreach ($unsurs as $unsur) {
            $score = PaAssessmentUnsurScore::where('assessment_users_id',$this->id)
                                            ->where('unsur_id',$unsur->id)->first();

            $external_score=0;
            $atasan_score = 0;
            $staff_score = 0;

            if($unsur->external_data){
                if($unsur->external_data==="hris_ijin"){
                    $ijinTanpaKeterangan = HrisAbsenRpt::where('nik',$this->participant_id)
                    ->whereNotIn('hari', ['Sabtu','Minggu'])
                    ->whereNotIn('status', ['LIBUR_NASIONAL'])
                    ->where('keterangan',"")
                    ->where('qtymasuk',0)
                    ->whereBetween(DB::raw('DATE(tgl)'), array($systemPAStartDate, $systemPAEndDate))
                    ->whereNull('ada_izin')
                    ->count();
                    if($ijinTanpaKeterangan > 3){
                        $external_score=1;
                    }else if($ijinTanpaKeterangan > 2){
                        $external_score=2;
                    }else if($ijinTanpaKeterangan > 1){
                        $external_score=3;
                    }else{
                        $external_score=4;
                    }
                }
                else if($unsur->external_data==="hris_absen"){
                    $telatAtauPulcep = HrisAbsenRpt::where('nik',$this->participant_id)
                    ->whereNotIn('status', ['LIBUR_NASIONAL'])
                    ->where(function($q) {
                        $q->where('qtytelat', 1)
                          ->orWhere('qtypulangcepat', 1);
                    })
                    ->whereBetween(DB::raw('DATE(tgl)'), array($systemPAStartDate, $systemPAEndDate))
                    ->whereNull('ada_izin')
                    ->count();
                    if($telatAtauPulcep > 10){
                        $external_score=1;
                    }else if($telatAtauPulcep > 6){
                        $external_score=2;
                    }else if($telatAtauPulcep > 3){
                        $external_score=3;
                    }else{
                        $external_score=4;
                    }
                }
                else if(strpos($unsur->external_data, 'survey') !== false){
                    $surveyId = intval(explode("-",$unsur->external_data)[1]);
                    $participantType =  DB::table('survey_trx_users')
                    ->join('survey_trxes', 'survey_trxes.id', '=', 'survey_trx_users.survey_trx_id')
                    ->where('survey_trxes.survey_id',$surveyId)
                    ->value('owner_type');
                    $surveyTrxUserIds = [];

                    if($participantType=='P'){
                        $surveyTrxUserIds =  DB::table('survey_trx_users')
                        ->join('survey_trxes', 'survey_trxes.id', '=', 'survey_trx_users.survey_trx_id')
                        ->where('survey_trxes.survey_id',$surveyId)
                        ->where('survey_trx_users.emp_owner_id',$this->participant_id)
                        ->pluck('survey_trx_users.id');
                    }else{
                        $surveyTrxUserIds =  DB::table('survey_trx_users')
                        ->join('survey_trxes', 'survey_trxes.id', '=', 'survey_trx_users.survey_trx_id')
                        ->where('survey_trxes.survey_id',$surveyId)
                        ->where('survey_trx_users.unit_owner_id',$participant->unit_id)
                        ->value('survey_trx_users.id');
                    }

                    if(sizeof($surveyTrxUserIds)>0){
                        $average = floatval(SurveyTrxAnswer::whereIn('survey_trx_user_id',$surveyTrxUserIds)->where('score','<>',0)->avg('score'));
                        $external_score=$average;
                    }else{
                        $external_score=0;
                    }
                }
                else{
                    $external_score= (int) PaExternalData::where('key_name','unit_id')
                    ->where('key_id',strval($participant->unit_id))
                    ->where('group',$unsur->external_data)
                    ->where('periode', Setting::where('indicator', 'periode_active')->value('value'))
                    ->value('value');
                }


                $atasan_score = $external_score;
                $staff_score = $external_score;
            }else{
                $atasan_score = $score!=null ? $score->atasan_score : 0;
                $staff_score = $score!=null ? $score->staff_score : 0;
            }



            array_push($array_unsurs,[
                "id"=> $unsur->id,
                "sub_aspek_id"=> $unsur->sub_aspek_id,
                "code"=> $unsur->code,
                "name"=>$unsur->name,
                "is_optional"=>$unsur->is_optional,
                "is_custom"=>$unsur->is_custom,
                "external_data"=>$unsur->external_data,
                "external_score"=>$external_score,
                'category_1_label'=>$unsur->category_1_label,
                'category_2_label'=>$unsur->category_2_label,
                'category_3_label'=>$unsur->category_3_label,
                'category_4_label'=>$unsur->category_4_label,
                "status"=> $unsur->status,
                "bobot"=> $unsur->pivot->bobot,
                "atasan_score"=>$atasan_score,
                "staff_score"=>$staff_score,
                "atasanPercentScore"=> $score!=null ? ($score->atasan_score*$unsur->pivot->bobot/100)  : 0,
                "staffPercentScore"=> $score!=null ? ($score->staff_score*$unsur->pivot->bobot/100) : 0,
                "test"=>$test
            ]);
        }

        $unsurToUsers = PaUnsurToUser::where('user_id',$this->participant_id)->get();

        //push custom unsur
        foreach ($unsurToUsers as $utu) {
            $unsur = PaUnsur::where('id',$utu->unsur_id)
                            ->whereIn("sub_aspek_id",$array_sub_aspek_custom_ids)->first();
            if($unsur){
                $score = PaAssessmentUnsurScore::where('assessment_users_id',$this->id)
                                            ->where('unsur_id',$unsur->id)->first();


                array_push($array_unsurs,[
                    "id"=> $unsur->id,
                    "sub_aspek_id"=> $unsur->sub_aspek_id,
                    "code"=> $unsur->code,
                    "name"=>$unsur->name,
                    "is_optional"=>$unsur->is_optional,
                    "is_custom"=>$unsur->is_custom,
                    "external_data"=>$unsur->external_data,
                    "external_score"=>0,
                    'category_1_label'=>$unsur->category_1_label,
                    'category_2_label'=>$unsur->category_2_label,
                    'category_3_label'=>$unsur->category_3_label,
                    'category_4_label'=>$unsur->category_4_label,
                    "status"=> $unsur->status,
                    "bobot"=> $utu->bobot,
                    "atasan_score"=>$score!=null ? $score->atasan_score : 0,
                    "staff_score"=>$score!=null ? $score->staff_score : 0,
                    "atasanPercentScore"=> $score!=null ? ($score->atasan_score*$utu->bobot/100)  : 0,
                    "staffPercentScore"=> $score!=null ? ($score->staff_score*$utu->bobot/100) : 0
                ]);
            }

        }


        return [
            'id' => $this->id,
            'master_id'=>$master->id,
            'master_name'=>$master->name,
            'participant_id'=>$this->participant_id,
            'participant_name'=>$participant->emp_name,
            'atasan_id'=>$this->atasan_id,
            'bobot_atasan'=>$master->bobot_atasan,
            'bobot_bawahan'=>$master->bobot_bawahan,
            'total_score'=>floatval($this->total_score),
            'aspeks'=>$array_aspeks,
            'sub_aspeks'=>$array_sub_aspeks,
            'unsurs'=>$array_unsurs
        ];
    }
}
