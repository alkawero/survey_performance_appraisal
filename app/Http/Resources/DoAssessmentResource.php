<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\PaAssessmentUser;
use App\PaAssessmentUnsurScore;
use App\PaSubAspekScore;
use App\PaAspekScore;
use App\PaUnsurToUser;
use App\PaSubAspekToUser;
use App\PaUnsur;

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
        $assessment = $this->assessment()->first();
        $participant = $this->participant()->first();
        $master = $assessment->master()->first();
        $unsurs = $master->unsurs()->get();
        $aspeks = $master->aspeks()->get();
        $array_aspeks = [];//$aspeks->toArray();
        $array_sub_aspeks = [];
        $array_unsurs = [];
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
            }

            array_push($array_aspeks,$aspek->toArray());

        }

        //push fixed unsur
        foreach ($unsurs as $unsur) {
            $score = PaAssessmentUnsurScore::where('assessment_users_id',$this->id)
                                            ->where('unsur_id',$unsur->id)->first();
            array_push($array_unsurs,[
                "id"=> $unsur->id,
                "sub_aspek_id"=> $unsur->sub_aspek_id,
                "code"=> $unsur->code,
                "name"=>$unsur->name,
                'category_1_label'=>$unsur->category_1_label,
                'category_2_label'=>$unsur->category_2_label,
                'category_3_label'=>$unsur->category_3_label,
                'category_4_label'=>$unsur->category_4_label,
                "status"=> $unsur->status,
                "bobot"=> $unsur->pivot->bobot,
                "atasan_score"=>$score!=null ? $score->atasan_score : 0,
                "staff_score"=>$score!=null ? $score->staff_score : 0,
                "atasanPercentScore"=> $score!=null ? ($score->atasan_score*$unsur->pivot->bobot/100)  : 0,
                "staffPercentScore"=> $score!=null ? ($score->staff_score*$unsur->pivot->bobot/100) : 0
            ]);
        }

        $unsurToUsers = PaUnsurToUser::where('user_id',$this->participant_id)->get();

        //push custom unsur
        foreach ($unsurToUsers as $utu) {
            $unsur = PaUnsur::find($utu->unsur_id);
            $score = PaAssessmentUnsurScore::where('assessment_users_id',$this->id)
                                            ->where('unsur_id',$unsur->id)->first();
            array_push($array_unsurs,[
                "id"=> $unsur->id,
                "sub_aspek_id"=> $unsur->sub_aspek_id,
                "code"=> $unsur->code,
                "name"=>$unsur->name,
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
