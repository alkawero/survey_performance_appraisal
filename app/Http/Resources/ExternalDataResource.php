<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use \App\Unit;

class ExternalDataResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $unit = Unit::find(intval($this->key_id));
        $name_by_key = "";
        if($this->key_name==="unit_id"){
            $name_by_key = $unit->unit_name;
        }
        return [
            'id' => $this->id,
            'key_id'=>$this->key_id,
            'name_by_key'=>$name_by_key,
            'key_name'=>$this->key_name,
            'value'=>$this->value,
            'group'=>$this->group,
            'periode'=>$this->periode,
            'created_by'=>$this->created_by,
            'updated_by'=> $this->updated_by,
        ];
    }
}
