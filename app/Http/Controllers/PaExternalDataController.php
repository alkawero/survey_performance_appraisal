<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\PaExternalData;
use App\Http\Resources\ExternalDataResource;
use Illuminate\Support\Facades\DB;

class PaExternalDataController extends Controller
{

    public function getByParams(Request $request){

        $query = PaExternalData::when($request->key_id, function ($query) use ($request) {
            return $query->where('key_id', $request->key_id);
        })
        ->when($request->key_name, function ($query) use ($request) {
            return $query->where('key_name', $request->key_name);
        })
        ->when($request->group, function ($query) use ($request) {
            return $query->where('group', $request->group);
        })
        ->when($request->periode, function ($query) use ($request) {
            return $query->where('periode', $request->periode);
        });

        if($request->rowsPerPage)
        return ExternalDataResource::collection($query->paginate($request->rowsPerPage));
        else
        return ExternalDataResource::collection($query->get());
    }

    public function store(Request $request)
    {
        DB::table('external_datas')->insert($request->data);

    }

    public function update(Request $request)
    {
        $data = PaExternalData::find($request->id);
        $data->key_id = $request->key_id;
        $data->key_name = $request->key_name;
        $data->value = $request->value;
        $data->group = $request->group;
        $data->periode = $request->periode;
        $data->updated_by = $request->updated_by;
        $data->save();
    }

    public function getGroups(){
        return PaExternalData::groupBy('group')->pluck('group');
    }

    public function getPeriode(){
        return PaExternalData::groupBy('periode')->pluck('periode');
    }

    public function deleteById(Request $request){
        DB::table('external_datas')->where('id', $request->id)->delete();
    }





}
