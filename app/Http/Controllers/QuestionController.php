<?php

namespace App\Http\Controllers;

use App\Question;
use App\QuestionGroup;

use Illuminate\Http\Request;
use function GuzzleHttp\json_decode;
use App\Http\Resources\QuestionByGroupResource;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getQuestionList($startFrom)
    {
        $defaultRow = 25;
        $data = Question::paginate($defaultRow);
        return $data;
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $arrayjson = json_encode($request->options);
        $arrayObject = json_decode($arrayjson,true);
        $question = new Question();
        $question->type = $request->type;
        $question->question = $request->question;
        $question->need_reason = $request->need_reason;
        $group = QuestionGroup::find($request->group);

        $group->questions()->save($question);
        $question->options()->createMany($arrayObject);
    }


    public function getQuestionByGroup($groupId)
    {
         $questions = QuestionGroup::find($groupId)->questions()->select('id','question','type','need_reason','active')->get();
         return QuestionByGroupResource::collection($questions);

    }

    public function destroy(Question $question)
    {
        $depend = 0;
        if($question->answers()->count()>0){
            $depend++;            
        }

        if($depend>0){
            return $depend;
        }else{
            if($question->options()->count() > 0){
                foreach($question->options()->get() as $option){
                    $option->delete();
                }
            }            
            $question->delete();
        }
        
    }

    public function toggleActive(Question $question)
    {
        if($question->active==1){
            $question->active=0;            
        }else{
            $question->active=1;            
        }
        $question->save();
    }
    
}
