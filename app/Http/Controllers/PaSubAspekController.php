<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\PaSubAspek;
use App\Http\Resources\SubAspekResource;

class PaSubAspekController extends Controller
{
    public function getByParams(Request $request){

        $query = PaSubAspek::when($request->aspek_id, function ($query) use ($request) {
            return $query->where('aspek_id', $request->aspek_id);
        })
        ->when($request->aspek_ids, function ($query) use ($request) {
            return $query->whereIn('aspek_id', $request->aspek_ids);
        });


        if($request->rowsPerPage)
        return SubAspekResource::collection($query->paginate($request->rowsPerPage));
        else
        return SubAspekResource::collection($query->get());
    }

    public function store(Request $request)
    {
        $subAspek = new PaSubAspek();
        $subAspek->aspek_id = $request->aspek_id;
        $subAspek->name = $request->name;
        $subAspek->code = $request->code;
        $subAspek->created_by = $request->creator;
        $subAspek->status = $request->status;
        $subAspek->save();
    }

    public function update(Request $request)
    {
        $aspek = PaSubAspek::find($request->id);
        $aspek->name = $request->name;
        $aspek->code = $request->code;
        $aspek->updated_by = $request->updated_by;
        $aspek->save();
    }
}
