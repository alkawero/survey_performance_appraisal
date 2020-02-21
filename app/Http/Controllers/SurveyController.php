<?php

namespace App\Http\Controllers;

use App\Survey;
use App\SurveyTrx;
use App\SurveyTrxUser;
use App\SurveyTrxAnswer;
use App\User;
use App\Unit;

use App\Question;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Resources\SurveyTasksResource;
use App\Http\Resources\SurveyTasksResourceAdmin;
use App\Http\Resources\SurveyTaskDetailResource;
use App\Http\Resources\SurveyorAnswerResource;
use App\Http\Resources\SurveyImplementationResource;


class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getSurvey($id)
    {
        return $survey = Survey::where('id',$id)
                ->with('question_groups')
                ->first();
    }

    public function getSurveyForSelect(Request $request)
    {
        $survey = Survey::select('id','judul')->get();
        return $survey;
    }

    public function getEmpOwnerSurvey($id)
    {
        $survey = Survey::find($id);
        $trxs = $survey->transactions()->get();
        $empOwners = array();
        
        foreach($trxs as $t){
            $trxEmpUsers = DB::table('hris_survey.survey_trx_users')
                            ->where('survey_trx_id', $t->id)
                            ->whereNotNull('emp_owner_id')
                            ->pluck('emp_owner_id');
            $owners = User::select('emp_id','emp_name')
                            ->whereIn('emp_id',$trxEmpUsers)
                            ->get();

            //$owners = $t->empOwners()->get();
            if(!count($owners)==0){
                //array_push($empOwners,$owners);
                foreach($owners as $o){
                    if (!in_array((object)['id'=>$o->emp_id, 'name'=>$o->emp_name], $empOwners)) {
                        array_push($empOwners,(object)['id'=>$o->emp_id, 'name'=>$o->emp_name]);
                    }
                }
            }
        }
        return $empOwners;
    }

    public function getSurveyorSurvey($surveyId='',$unitId='',$empId='',$from='',$until='')
    {
        $survey = Survey::find($surveyId);

        $trxs = $survey->transactions()
                        ->whereBetween('valid_from', [$from, $until])
                        ->orwherebetween('valid_until', [$from, $until])->get();

        $surveyorsAll = array();
        foreach($trxs as $t){
            $surveyors = $t->surveyors()->get();
            if(!count($surveyors)==0){
                foreach($surveyors as $s){
                    if (!in_array((object)['id'=>$s->emp_id, 'name'=>$s->emp_name], $surveyorsAll)) {
                        array_push($surveyorsAll,(object)['id'=>$s->emp_id, 'name'=>$s->emp_name,'pivot_id'=>$s->pivot->id]);
                    }
                }
            }
        }
        return $surveyorsAll;
    }


    public function getSurveyorAnswer($surveyTrxUserId)
    {
        $surveyTrxUser = SurveyTrxUser::find($surveyTrxUserId);
        $answers = $surveyTrxUser->answers()->get();
        return SurveyorAnswerResource::collection($answers);

    }

    public function getUnitOwnerSurvey($id)
    {
        $survey = Survey::find($id);
        $trxs = $survey->transactions()->get();
        $unitOwners = array();
        foreach($trxs as $t){
            
            $trxUnitUsers = DB::table('hris_survey.survey_trx_users')
                            ->where('survey_trx_id', $t->id)
                            ->whereNotNull('unit_owner_id')
                            ->pluck('unit_owner_id');
            
            $owners = Unit::whereIn('unit_id',$trxUnitUsers)
                            ->get();
            //$owners = $t->unitOwners()->get();
            if(!count($owners)==0){
                foreach($owners as $o){
                    if (!in_array((object)['id'=>$o->unit_id, 'name'=>$o->unit_name], $unitOwners)) {
                        array_push($unitOwners,(object)['id'=>$o->unit_id, 'name'=>$o->unit_name]);
                    }
                }
            }
        }
        return $unitOwners;
    }



    public function getSurveyList($startFrom)
    {
        $defaultRow = 25;
        $data = Survey::paginate($defaultRow);
        return $data;
    }

    public function storeSurvey(Request $request)
    {        
        $survey = new Survey();  
        $survey->judul = $request->tittle;
        $survey->active = '1';
        $survey->description = $request->description;
        $survey->save();
        
        $survey->question_groups()->attach($request->questionGroups);

        $implementation = $request->implementation;
        if($implementation===true){ //save the implementation, not only survey
            
                $trx = new SurveyTrx();                                     
                $trx->owner_type=$request->ownerType;
                $trx->valid_from=$request->validFrom;
                $trx->valid_until=$request->validUntil;
                $trx->active = $request->active;
                $survey->transactions()->save($trx);
                
                

                if(!empty($request->surveyors)){
                    $arrayTrxUser = array();
                    foreach($request->surveyors as $surveyor){
                        array_push($arrayTrxUser,([
                            'emp_owner_id'=>$request->empOwner,
                            'unit_owner_id'=>$request->unitOwner,
                            'surveyor_emp_id'=>$surveyor]
                        ));                    
                    }
                    $trx->surveyTrxUsers()->createMany($arrayTrxUser);
                }                               
            
        }
    }

    public function updateSurveyImplementation(Request $request){
        $trx= SurveyTrx::find($request->survey_trx_id);                       
        $trx->owner_type=$request->ownerType;
        $trx->valid_from=$request->validFrom;
        $trx->valid_until=$request->validUntil;
        $trx->active = $request->active;
        $trx->save();

        //update the trxuser mapping if owner change
        SurveyTrxUser::where('survey_trx_id',$request->survey_trx_id)     
                        ->update(['emp_owner_id'=>$request->empOwner,
                                  'unit_owner_id'=>$request->unitOwner]);
        
        if(!empty($request->toDeleteSurveyor)){
            SurveyTrxUser::where('survey_trx_id',$request->survey_trx_id)
                            ->whereIn('surveyor_emp_id',$request->toDeleteSurveyor)
                            ->delete();
        }

        if(!empty($request->newSurveyor)){
            $arrayTrxUser = array();
            foreach($request->newSurveyor as $surveyor){
                array_push($arrayTrxUser,([
                    'emp_owner_id'=>$request->empOwner,
                    'unit_owner_id'=>$request->unitOwner,
                    'surveyor_emp_id'=>$surveyor]
                ));                    
            }
            $trx->surveyTrxUsers()->createMany($arrayTrxUser);
        }
                       
        
    }

    public function storeSurveyImplementation(Request $request){
        $survey = Survey::find($request->surveyId);  
        
        $trx = new SurveyTrx();                                     
        $trx->owner_type=$request->ownerType;
        $trx->valid_from=$request->validFrom;
        $trx->valid_until=$request->validUntil;
        $trx->active = $request->active;
        $survey->transactions()->save($trx);      
        

        if(!empty($request->surveyors)){
            $arrayTrxUser = array();
            foreach($request->surveyors as $surveyor){
                array_push($arrayTrxUser,([
                    'emp_owner_id'=>$request->empOwner,
                    'unit_owner_id'=>$request->unitOwner,
                    'surveyor_emp_id'=>$surveyor]
                ));                    
            }
            $trx->surveyTrxUsers()->createMany($arrayTrxUser);
        }                                                               
    }

    

    public function getSurveyTasks($surveyorId='',$surveyId='null',$ownerName='null',$pagination=5)
    {        
            $trxs = [];
            $users = [];
            $units = [];
            if($surveyId!='null'){
                $survey = Survey::find($surveyId);
                $trxs = $survey->transactions()->pluck('survey_trxes.id');    
                
            }
            if($ownerName!='null' && $ownerName!='admin'){
                $users = User::where('emp_name','like','%'.$ownerName.'%')->pluck('emp_id');
                $units = Unit::where('unit_name','like','%'.$ownerName.'%')->pluck('unit_id');
                
            }           

            if($surveyorId=='admin'){//admin
                
                return SurveyTasksResourceAdmin::collection(
                    SurveyTrxUser::when($trxs, function ($query, $trxs) {
                        return $query->whereIn('survey_trx_id', $trxs);
                    })
                    ->when($users, function ($query, $users) {
                        return $query->whereIn('emp_owner_id', $users);
                    })
                    ->when($units, function ($query, $units) {
                        return $query->orWhereIn('unit_owner_id', $units);
                    })
                    ->groupBy('survey_trx_id')
                    ->paginate($pagination)
                );       
            }else{
                return SurveyTasksResource::collection(
                    SurveyTrxUser::where('surveyor_emp_id','=',$surveyorId)->paginate($pagination)
                );       
            }
            
    }

    public function getSurveyTaskDetail($surveyTrxUserid){
        $surveytrxUser = SurveyTrxUser::find($surveyTrxUserid);
        return new SurveyTaskDetailResource($surveytrxUser);
    }

    public function getSurveyImplementationDetail($surveyTrxUserId){
        $surveytrxUser = SurveyTrxUser::find($surveyTrxUserId);
        return new SurveyImplementationResource($surveytrxUser);
    }

    public function storeAnswer(Request $request)
    {
        
        $trxUser = SurveyTrxUser::find($request->trxUserId);
        $existingAnswers = $trxUser->answers()->pluck('id')->toArray();
        
        if(!empty($existingAnswers)){
        SurveyTrxAnswer::destroy($existingAnswers);}

        $response = $trxUser->answers()->createMany($request->answers);
        return $response;
    }

    public function getSurveyQuestions($surveyId)
    {
        $assessments = Survey::find($surveyId);
        $groups = $assessments->question_groups()->get();
        $allquestion = array();
        foreach($groups as $group){
            $allquestion = array_merge($allquestion, $group->questions()->get()->toArray());
        }
        return ($allquestion);
    }

    public function getSurveySummary($surveyId='',$ownerType='',$ownerId='',$summaryType='',$validFrom='',$validUntil='')
    {
        $survey = Survey::find($surveyId);       

        
        if($ownerType=='one_employee'){
            
            //$surveyTrx = $survey->transactions()->where('owner_type','P')->latest()->first();             
            //$surveyTrxUsers = $surveyTrx->surveyTrxUsers()->where('emp_owner_id',$ownerId)->with('surveyor')->get();
            $surveyTrx = SurveyTrx::where('survey_id',$surveyId)->pluck('id');
            $surveyTrxUsers = SurveyTrxUser::where('emp_owner_id',$ownerId)
                                ->whereIn('survey_trx_id',$surveyTrx)
                                ->with('surveyor')->get();
            $owner = User::select('emp_name')->where('emp_id',$ownerId)->first()->emp_name;
        }
        else if($ownerType=='one_department'){
            //$surveyTrx = $survey->transactions()->where('owner_type','D')->latest()->first(); //may be change      
            //$surveyTrxUsers = $surveyTrx->surveyTrxUsers()->where('unit_owner_id',$ownerId)->with('surveyor')->get();
            
            $surveyTrx = SurveyTrx::where('survey_id',$surveyId)->pluck('id');
            $surveyTrxUsers = SurveyTrxUser::where('unit_owner_id',$ownerId)
                                ->whereIn('survey_trx_id',$surveyTrx)
                                ->with('surveyor')->get();
            $owner = Unit::select('unit_name')->where('unit_id',$ownerId)->first()->unit_name;
        }
        else if($ownerType=='all_departments'){//cuma bisa score summary
            $surveyTrxs = $survey->transactions()->where('owner_type','D')->pluck('id'); //may be change       
            $surveyTrxUsers = SurveyTrxUser::whereIn('survey_trx_id',$surveyTrxs)
                                             ->whereNotNull('unit_owner_id')
                                             ->with(['surveyor','unitOwner','totalScoreByOneSurveyor'])->get();               
            $owner = 'All Departments';
            
        }
        else if($ownerType=='all_employees'){//cuma bisa score summary
            $surveyTrxs = $survey->transactions()->where('owner_type','P')->pluck('id'); //may be change      
            $surveyTrxUsers = SurveyTrxUser::whereIn('survey_trx_id',$surveyTrxs)
                                             ->whereNotNull('emp_owner_id')
                                             ->with(['surveyor','employeeOwner','totalScoreByOneSurveyor'])->get();
            $owner = 'All employees';
        }
        

        if($summaryType=='reason'){
            $questionGroup = $survey->question_groups()->get();
            $allquestion = array();
            foreach($questionGroup as $group){
                $allquestion = array_merge($allquestion, $group->questions()->get()->toArray());
            }
            $arrayTrxUserId = array();
            foreach($surveyTrxUsers as $trxUser){
                array_push($arrayTrxUserId,$trxUser->id);
            }

            //$answers = $surveyTrx->answers()->select('text','question_id','survey_trx_user_id')->get();
            $answers = SurveyTrxAnswer::whereIn('survey_trx_user_id',$arrayTrxUserId)->get();

            return $this->getReasonSummary($owner,$survey,$questionGroup,$allquestion,$answers);
        }
        else if($summaryType=='score'){
            
            return $this->getScoreSummary($owner,$survey,$surveyTrxUsers,$surveyTrxs);
        }       
        

    }

    public function getReasonSummary($owner,$survey,$questionGroup,$allquestion,$answers){
        return [
            'survey_tittle'=>$survey->judul,
            'summary_type'=>'reason',
            'question_groups'=>$questionGroup,
            'questions'=>$allquestion,            
            'answers'=>$answers,
            'owner'=>$owner           
        ];
    }

    public function getScoreSummary($owner,$survey,$surveyTrxUsers,$surveyTrxs){
        $surveyors = [];
        
        foreach($surveyTrxUsers as $trxuser){            
            $surveyor = (Object) ['trx_user_id' => $trxuser->id,
                                'surveyor_id' => $trxuser->surveyor->emp_id,
                                'surveyor_name' => $trxuser->surveyor->emp_name];
            array_push($surveyors, $surveyor);
        }
        $questionGroups = $survey->question_groups()->pluck('id');        
        
        $questionCount = Question::whereIn('question_group_id',$questionGroups)
                                    ->where('type','S')
                                    ->where('active',1)
                                    ->count();
        
        $answeredTrxUserId = DB::table('survey_trx_answers')->groupBy('survey_trx_user_id')->pluck('survey_trx_user_id');
        
        return [
            'survey_tittle'=>$survey->judul,
            'summary_type'=>'score',
            'users'=>$surveyTrxUsers,             
            'owner'=>$owner,
            'survey_trxs'=>$surveyTrxs,
            'answered_trx_user'=>   $answeredTrxUserId,
            'question_count'=>  $questionCount     
        ];
    }
    



    public function updateSurvey(Request $request)
    {
        $survey = Survey::find($request->id);
        $survey->judul = $request->tittle;
        $survey->description = $request->description;
        $survey->question_groups()->sync($request->questionGroups);
        $survey->save();

    }

    public function toggleSurveyImplementation(Request $request){
        $surveyTrx = SurveyTrx::find($request->surveyTrxId);
        $survey = $surveyTrx->survey()->first();
        $msg = '';
        if($surveyTrx->active=='1'){            
            $surveyTrx->active='0';
        }else{
            if($survey->active=='1')//check if survey is inactive
                $surveyTrx->active='1';
            else
            $msg =  'the survey is not active'; 
        }
        $surveyTrx->save();
        if($msg!='')
        return $msg;
    }

    public function toggleSurvey(Request $request){
        $survey = Survey::find($request->srvId);
        
        
        if($survey->active=='1'){
            $survey->active='0';
            $survey->transactions()->update(['active'=>'0']);
        }else{
            $survey->active='1';
            $survey->transactions()->update(['active'=>'1']);
        }
        $survey->save();
    }

    public function getUserNotAnswering(){
        $answeredTrxUserId = DB::table('survey_trx_answers')->groupBy('survey_trx_user_id')->pluck('survey_trx_user_id');
        $surveyors = DB::table('survey_trx_users')
                        ->whereNotIn('id',$answeredTrxUserId)
                        ->pluck('surveyor_emp_id');
        $surveyorsName = User::select('emp_id','emp_name')
                        ->whereIn('emp_id',$surveyors)                                                
                        ->get();
        return $surveyorsName;
    }

    

    
}
