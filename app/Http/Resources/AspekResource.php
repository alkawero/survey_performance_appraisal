<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AspekResource extends JsonResource
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
        $updater = $this->updater;
        return [
            'id' => $this->id,
            'code'=>$this->code,
            'name'=>$this->name,
            'note'=>$this->note,
            'is_custom'=>$this->is_custom,
            'fixed_bobot'=>$this->fixed_bobot,
            'master'=>$master,
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
