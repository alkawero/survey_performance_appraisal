<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MasterResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $aspeks = $this->aspeks()->get();
        $aspek_names ="";
        $aspek_codes ="";
        foreach ($aspeks as $aspek) {
            $aspek_names.=" ".$aspek->name;
            $aspek_codes.=" ".$aspek->code;
        }
        $updater = $this->updater;
        return [
            'id' => $this->id,
            'aspek_names'=>$aspek_names,
            'aspek_codes'=>$aspek_codes,
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
