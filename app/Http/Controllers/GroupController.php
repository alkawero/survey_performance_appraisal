<?php

namespace App\Http\Controllers;

use App\QuestionGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAll()
    {
        return QuestionGroup::select('id','name','description')->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }


    public function store(Request $request)
    {
        $group = new QuestionGroup();
        $group->name = $request->name;
        $group->description = $request->description;
        $group->save();
    }

    public function update(Request $request)
    {
        try {
            DB::table('question_groups')
            ->where('id', $request->id)
            ->update(['name' => $request->name,
                    'description' => $request->description
            ]);
        } catch (\Illuminate\Database\QueryException $ex) {
            return 'error';
        }
        
    }

    public function delete($id)
    {
        try {
            $group = QuestionGroup::find($id);
            $depend = 0;
            if(($group->surveys()->count())>0){
                $depend++;
            }
            if(($group->questions()->count())>0){
                $depend++;
            }

            if($depend>0){
                return $depend;
            }else{
                $group->delete();
            }

        } catch (\Illuminate\Database\QueryException $ex) {
            return 'error'.$ex;
        }
        
    }



}
