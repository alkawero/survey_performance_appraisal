<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\PaMaster;
use \App\PaMasterBobotUnsur;
use App\Http\Resources\MasterResource;
use Illuminate\Support\Facades\DB;

class PaMasterController extends Controller
{

    public function getByParams(Request $request){

        if($request->master_id){
            return new MasterResource(PaMaster::find($request->master_id));
        }

        $query = PaMaster::when($request->master_id, function ($query) use ($request) {
            return $query->where('id', $request->master_id);
        });

        return MasterResource::collection($query->get());
    }

    public function getWeightById($master_id){
        $master = PaMaster::find($master_id) ;
        $masterWeight = $master->unsurs()->sum("bobot");
        return ["master_weight"=>$masterWeight];
    }



    public function store(Request $request)
    {
        //return ($request->bobot_unsurs);
        $master = new PaMaster();
        $master->name = $request->name;
        $master->bobot_atasan = $request->bobot_atasan;
        $master->bobot_bawahan = $request->bobot_bawahan;
        $master->periode = $request->periode;
        $master->semester = $request->semester;
        $master->valid_from=$request->validFrom;
        $master->valid_until=$request->validUntil;

        $master->created_by = $request->creator;
        $master->status = $request->status;
        $master->save();

        $aspek_ids = $request->aspek_ids;
        $master->aspeks()->sync($aspek_ids);

        $bobotUnsurs = $request->bobot_unsurs;
        foreach ($bobotUnsurs as $bu) {
            DB::table('pa_master_bobot_unsur')->insert(
                ['master_id' => $master->id, 'unsur_id' => $bu['unsur_id'], 'bobot' => $bu['bobot']]
            );
        }

    }
}
