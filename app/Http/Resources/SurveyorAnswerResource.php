<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\SurveyTrxUser;

class SurveyorAnswerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $question = $this->question()->first();
        $score = $question->type=='S'?$this->score:0;
        $code = $question->type=='M'?$this->code:'';
        $answer = '';
        $optionText = null;

        if($code != ''){
            $answer = $code;
            $optionText = $question->options()->select('text')->where('code','=',$code)->first();
        }else if($score !==0){
            $answer = $this->score;
        }else {$answer = $this->text;}
        return [
            'id'=>$this->id,
            'question'=>$question ? $question->question:'',
            'answer'=>$answer,
            'type'=>$question ? $question->type:'',
            'score'=>$score,
            'optionText'=>null!==$optionText?$optionText->text:'',
    ];
    }
}
