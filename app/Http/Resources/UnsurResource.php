<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UnsurResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $sub_aspek = $this->sub_aspek()->first();
        $updater = $this->updater;
        return [
            'id' => $this->id,
            'sub_aspek_id'=>$this->sub_aspek_id,
            'sub_aspek_code'=>$sub_aspek->code,
            'sub_aspek_name'=>$sub_aspek->name,
            'category_1_label'=>$this->category_1_label,
            'category_2_label'=>$this->category_2_label,
            'category_3_label'=>$this->category_3_label,
            'category_4_label'=>$this->category_4_label,
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
