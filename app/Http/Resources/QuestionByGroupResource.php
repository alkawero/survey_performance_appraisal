<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class QuestionByGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $options = $this->options()->get();
        if($this->type=='E')
            $options = [];
        return [
            'id'=>$this->id,
            'question'=>$this->question,
            'type'=>$this->type,
            'score'=>empty($options)?[]:[$options[0]->code,$options[0]->text],
            'options'=>$options,
            'need_reason'=>$this->need_reason,
            'active'=>$this->active
        ];
    }
}
