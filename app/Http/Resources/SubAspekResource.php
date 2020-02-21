<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SubAspekResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $aspek = $this->aspek()->first();
        $updater = $this->updater;
        return [
            'id' => $this->id,
            'aspek_id'=>$this->aspek_id,
            'aspek_code'=>$aspek->code,
            'aspek_name'=>$aspek->name,
            'code'=>$this->code,
            'name'=>$this->name,
            'created_by_id'=> $this->created_by,
            'created_by_name'=> $this->creator->emp_name,
            'updated_by_id'=>$this->updated_by,
            'updated_by_name'=>$updater!==null? $updater->emp_name : null,
            'status_code'=>$this->status,
            'status_value'=>$this->status==1? "active":"inactive",
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
