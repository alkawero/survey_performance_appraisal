<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\PaAspek;
use \App\PaSubAspek;
use \App\PaMaster;
use \App\PaUnsur;
use \App\PaAspekDetailer;
use App\Http\Resources\AspekResource;
use Illuminate\Support\Facades\DB;

class PaAspekController extends Controller
{
    public function getByParams(Request $request){

        $aspeks ;

        $aspeks = PaAspek::when($request->is_custom!==null, function ($query) use ($request) {
            return $query->where('is_custom', $request->is_custom);
        });

        if($request->user_id){
            $aspek_ids = PaAspekDetailer::select("aspek_id")->where('detailer_id',$request->user_id)->get();
            $aspeks = $aspeks->whereIn("id",$aspek_ids) ;
        }



        if($request->rowsPerPage)
        return AspekResource::collection($aspeks->paginate($request->rowsPerPage));
        else
        return AspekResource::collection($aspeks->get());

    }

    public function update(Request $request)
    {
        $aspek = PaAspek::find($request->id);
        $aspek->name = $request->name;
        $aspek->code = $request->code;
        $aspek->note = $request->note;
        $aspek->status = $request->status;
        $aspek->updated_by = $request->updated_by;
        $aspek->save();
    }

    public function store(Request $request)
    {
        $aspek = new PaAspek();
        $aspek->name = $request->name;
        $aspek->code = $request->code;
        $aspek->note = $request->note;
        $aspek->fixed_bobot = $request->fixed_bobot;
        $aspek->is_custom = $request->is_custom;
        $aspek->created_by = $request->creator;
        $aspek->status = $request->status;
        $aspek->save();

        if($request->is_custom == 0){
            $subAspeks = $request->sub_aspeks;
            $unsurs = $request->unsurs;

            foreach ($subAspeks as $sub) {
                $subAspek = new PaSubAspek();
                $subAspek->aspek_id = $aspek->id;
                $subAspek->name = $sub['sub_aspek_name'];
                $subAspek->code = $sub['sub_aspek_code'];
                $subAspek->created_by = $request->creator;
                $subAspek->status = $request->status;
                $subAspek->save();

                foreach ($unsurs as $uns) {
                    if($uns['sub_aspek_code'] == $sub['sub_aspek_code']){
                        $unsur = new PaUnsur();
                        $unsur->sub_aspek_id = $subAspek->id;
                        $unsur->name = $uns['unsur_name'];
                        $unsur->code = $uns['unsur_code'];
                        $unsur->external_data = $uns['external_data'];
                        $unsur->category_1_label = $uns['category_1_label'];
                        $unsur->category_2_label = $uns['category_2_label'];
                        $unsur->category_3_label = $uns['category_3_label'];
                        $unsur->category_4_label = $uns['category_4_label'];
                        $unsur->created_by = $request->creator;
                        $unsur->status = $request->status;
                        $unsur->save();
                    }
                }

            }

        }else{
            $master = PaMaster::find($request->master_id);
            $master->aspeks()->attach($aspek->id);

            $detailers = $request->detailers;
            foreach ($detailers as $emp_id) {
                DB::table('aspek_detailers')->insert(
                    ['aspek_id' => $aspek->id, 'detailer_id' => $emp_id]
                );
            }
        }
    }


    public function deleteById(Request $request){
        $subAspekIds = DB::table('pa_sub_aspeks')->where('aspek_id', $request->id)->pluck('id');
        $unsurIds = DB::table('pa_unsurs')->whereIn('sub_aspek_id', $subAspekIds)->pluck('id');

        DB::table('aspek_detailers')->where('aspek_id', $request->id)->delete();
        DB::table('masters_aspeks')->where('aspek_id', $request->id)->delete();
        DB::table('aspek_scores')->where('aspek_id', $request->id)->delete();
        DB::table('aspek_to_users')->where('aspek_id', $request->id)->delete();
        DB::table('sub_aspek_scores')->whereIn('sub_aspek_id', $subAspekIds)->delete();
        DB::table('sub_aspek_to_users')->whereIn('sub_aspek_id', $subAspekIds)->delete();
        DB::table('assessment_unsur_scores')->whereIn('unsur_id', $unsurIds)->delete();
        DB::table('pa_master_bobot_unsur')->whereIn('unsur_id', $unsurIds)->delete();
        DB::table('pa_scores')->whereIn('unsur_id', $unsurIds)->delete();
        DB::table('unsur_to_users')->whereIn('unsur_id', $unsurIds)->delete();
        DB::table('pa_unsurs')->whereIn('sub_aspek_id', $subAspekIds)->delete();
        DB::table('pa_sub_aspeks')->where('aspek_id', $request->id)->delete();
        DB::table('pa_aspeks')->where('id', $request->id)->delete();
    }
}
