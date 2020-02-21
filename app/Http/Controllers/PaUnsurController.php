<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\PaUnsur;
use App\Http\Resources\UnsurResource;

class PaUnsurController extends Controller
{
    public function getByParams(Request $request){
        $query = PaUnsur::when($request->sub_aspek_id, function ($query) use ($request) {
            return $query->where('sub_aspek_id', $request->sub_aspek_id);
        })
        ->when($request->sub_aspek_ids, function ($query) use ($request) {
            return $query->whereIn('sub_aspek_id', $request->sub_aspek_ids);
        });

        if($request->rowsPerPage)
        return UnsurResource::collection($query->paginate($request->rowsPerPage));
        else
        return UnsurResource::collection($query->get());
    }

    public function store(Request $request)
    {
        $order=1;
        $existedUnsur = PaUnsur::where('sub_aspek_id',$request->sub_aspek_id)->count();
        if($existedUnsur>0){
            $order = $existedUnsur+1;
        }

        $unsur = new PaUnsur();
        $unsur->sub_aspek_id = $request->sub_aspek_id;
        $unsur->name = $request->name;
        $unsur->code = $request->code;
        $unsur->created_by = $request->creator;
        $unsur->status = $request->status;
        $unsur->save();
    }

    public function update(Request $request)
    {
        $aspek = PaUnsur::find($request->id);
        $aspek->name = $request->name;
        $aspek->code = $request->code;
        $aspek->updated_by = $request->updated_by;
        $aspek->save();
    }
}
