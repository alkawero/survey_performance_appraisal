<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\PaAssessment;
use \App\PaAssessmentUser;
use \App\PaAssessmentUnsurScore;
use \App\PaSubAspek;
use \App\PaUnsur;
use \App\Setting;
use \App\PaMaster;
use \App\User;
use \App\Unit;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\AssessmentUserResource;
use App\Http\Resources\DoAssessmentResource;
use App\Http\Resources\AssessmentByAspekResource;
use App\Http\Resources\AssessmentDetailResource;
use App\Http\Resources\AssessmentExportExcelResource;
use Illuminate\Support\Facades\DB;
use App\Exports\ScoreExcellExport;
use Maatwebsite\Excel\Facades\Excel;
use PDF;

class PaAssessmentController extends Controller
{


    public function getMyAssessments(Request $request){

        if($request->user_id){
            $assessmentUsers = PaAssessmentUser::where("participant_id",$request->user_id)
                        ->orWhere("atasan_id",$request->user_id);
        }

        if($request->rowsPerPage)
            return AssessmentUserResource::collection($assessmentUsers->paginate($request->rowsPerPage));
        else
            return AssessmentUserResource::collection($assessmentUsers->get());
    }

    public function getDataAssessment(Request $request){
        return $this->getReturnFromResource(
            $this->getByParams($request)
        );
    }

    public function getReturnFromResource($collection){
        return AssessmentUserResource::collection($collection);
    }


    public function getByParams(Request $request){
        $user_ids = [];
        $filtering = false;

        if($request->master_id){
            $master = PaMaster::find($request->master_id);
            $assessmentIds = $master->assessments()->pluck('id')->toArray();
            $user_ids = PaAssessmentUser::whereIn('assessment_id',$assessmentIds)->pluck('participant_id')->toArray();
            $filtering = true;
        }


        if($request->unit_id){
            $array_temp = [] ;
            $user_ids_inUnit = User::where('unit_id',$request->unit_id)->pluck('emp_id')->toArray();

            if($filtering){
                if(sizeof($user_ids) > 0){
                    foreach ($user_ids as $value) {
                        if(in_array($value, $user_ids_inUnit)){
                            array_push($array_temp,$value);
                        }
                    }
                }
                $user_ids = $array_temp;
            }else{
                $user_ids = $user_ids_inUnit;
            }

            $filtering = true;
        }

        if($request->participant_ids){
            $array_temp = [] ;
            $participant_ids = $request->participant_ids;

            if($filtering){
                if(sizeof($user_ids) > 0){
                    foreach ($user_ids as $value) {
                        if(in_array($value, $participant_ids)){
                            array_push($array_temp,$value);
                        }
                    }
                }
                $user_ids = $array_temp;
            }else{
                $user_ids = $participant_ids;
            }

            $filtering = true;
        }

        if($filtering){
            $assessmentUsers = PaAssessmentUser::whereIn('participant_id',$user_ids);
        }else{
            $assessmentUsers = new PaAssessmentUser();
        }


        if($request->rowsPerPage)
        return $assessmentUsers->paginate($request->rowsPerPage);
        else
        return $assessmentUsers->get();
    }

    public function getDataDoAssessments(Request $request){
        $assessmentUser = PaAssessmentUser::find($request->assessment_user_id);
        return new DoAssessmentResource($assessmentUser);
    }

    public function getAssessmentDetail(Request $request){
        $assessmentUser = PaAssessmentUser::find($request->assessment_user_id);
        return new AssessmentDetailResource($assessmentUser);
    }

    public function getAssessmentByAspek(Request $request){

        $assessments = PaAssessment::where("created_by",$request->leader_id)
                                    ->where("custom_aspek_id",$request->aspek_id)->get();
        return AssessmentByAspekResource::collection($assessments);
    }

    public function getAvalableStaff(Request $request){

        $assessments = PaAssessment::where("created_by",$request->leader_id)
                                    ->where("custom_aspek_id",$request->aspek_id)->pluck('id')->toArray();

        $participants = PaAssessmentUser::whereIn('assessment_id',$assessments)->pluck('participant_id')->toArray();

        $users = User::select('emp_id','emp_name')
                    ->where('emp_status',1)
                    ->where('unit_id',$request->unit_id)
                    ->whereNotIn('emp_id',$participants)->get();
        return $users;
    }

    public function store(Request $request)
    {
        $assessment = new PaAssessment();
        $assessment->pa_master_id = $request->pa_master_id;
        $assessment->created_by = $request->creator;
        $assessment->status = $request->status;
        $assessment->periode = $request->periode;
        $assessment->semester = $request->semester;
        $assessment->valid_from=$request->validFrom;
        $assessment->valid_until=$request->validUntil;
        $assessment->save();

        $participants = $request->participants;
        $leader_id = $request->leader_id;
        foreach ($participants as $emp_id) {
            DB::table('assessments_users')->insert(
                ['assessment_id' => $assessment->id,
                'participant_id' => $emp_id,
                'atasan_id' => $leader_id===null ? $this->getAtasanId($emp_id) : $leader_id]
            );
        }
    }

    public function storeAssessmentByAspek(Request $request)
    {
        $periode = Setting::where('indicator','periode_active')->value('value');
        $semester_active = Setting::where('indicator','semester_active')->value('value');
        $appraisal_start_date = Setting::where('indicator','appraisal_start_date')->value('value');
        $appraisal_end_date = Setting::where('indicator','appraisal_end_date')->value('value');

        $subAspeks = $request->sub_aspeks;
            $unsurs = $request->unsurs;

            foreach ($subAspeks as $sub) {
                $subAspek = new PaSubAspek();
                $subAspek->aspek_id = $request->aspek_id;
                $subAspek->name = $sub['sub_aspek_name'];
                $subAspek->code = $sub['sub_aspek_code'];
                $subAspek->is_custom = 1;
                $subAspek->created_by = $request->creator;
                $subAspek->status = $request->status;
                $subAspek->save();

                foreach ($request->participants as $emp_id) {
                    DB::table('sub_aspek_to_users')->insert(
                        ['sub_aspek_id' => $subAspek->id, 'user_id' => $emp_id]
                    );
                }

                foreach ($unsurs as $uns) {
                    if($uns['sub_aspek_code'] == $sub['sub_aspek_code']){
                        $unsur = new PaUnsur();
                        $unsur->sub_aspek_id = $subAspek->id;
                        $unsur->name = $uns['unsur_name'];
                        $unsur->code = $uns['unsur_code'];
                        $unsur->is_custom = 1;
                        $unsur->is_optional = $uns['is_optional'];
                        $unsur->category_1_label = $uns['category_1_label'];
                        $unsur->category_2_label = $uns['category_2_label'];
                        $unsur->category_3_label = $uns['category_3_label'];
                        $unsur->category_4_label = $uns['category_4_label'];
                        $unsur->created_by = $request->creator;
                        $unsur->status = $request->status;
                        $unsur->save();

                        foreach ($request->participants as $emp_id) {
                            DB::table('unsur_to_users')->insert(
                                ['unsur_id' => $unsur->id, 'user_id' => $emp_id, 'bobot'=>(int)$uns['bobot']]
                            );
                        }

                    }
                }

            }

        $assessment = new PaAssessment();
        $assessment->pa_master_id = $request->pa_master_id;
        $assessment->custom_aspek_id = $request->aspek_id;
        $assessment->created_by = $request->creator;
        $assessment->status = $request->status;
        $assessment->periode = $periode;
        $assessment->semester = intval($semester_active);
        $assessment->valid_from=$appraisal_start_date;
        $assessment->valid_until=$appraisal_end_date;
        $assessment->save();

        $participants = $request->participants;
        foreach ($participants as $emp_id) {
            DB::table('assessments_users')->insert(
                ['assessment_id' => $assessment->id, 'participant_id' => $emp_id,'atasan_id' => $this->getAtasanId($emp_id)]
            );
        }


    }

    private function getAtasanId($emp_id){
        $user = User::find($emp_id);
        $unit = Unit::find($user->unit_id);
        $atasan = User::where("key_id",$unit->report_to_id)->first();
        return $atasan->emp_id;
    }

    public function storeScores(Request $request)
    {
        $existingUnsurScore = PaAssessmentUnsurScore::where('assessment_users_id',$request->assessment_users_id)->first();

        if($existingUnsurScore==null){

            foreach ($request->aspekScores as $score) {//insert aspek score
                DB::table('aspek_scores')->insert(
                    ['assessment_users_id' => $request->assessment_users_id,
                    'aspek_id' => $score['aspek_id'],
                    'score' => $score['score']]
                );
            }

            foreach ($request->subAspekScores as $score) {//insert subaspek score
                DB::table('sub_aspek_scores')->insert(
                    ['assessment_users_id' => $request->assessment_users_id,
                    'sub_aspek_id' => $score['sub_aspek_id'],
                    'score' => $score['score']]
                );
            }

            if($request->score_by==="atasan"){
                $paAssessmentUser = PaAssessmentUser::find($request->assessment_users_id);
                $paAssessmentUser->fill_by_atasan = 1;
                $paAssessmentUser->total_score = $request->total_score;
                $paAssessmentUser->note_atasan = $request->note_atasan;
                $paAssessmentUser->approval_staff = 0;
                $paAssessmentUser->save();

                foreach ($request->unsurScores as $score) {
                    DB::table('assessment_unsur_scores')->insert(
                        ['assessment_users_id' => $request->assessment_users_id,
                        'unsur_id' => $score['unsur_id'],
                        'atasan_score' => $score['atasan_score'],
                        'bobot' => $score['bobot']]
                    );
                }
            }else{
                $paAssessmentUser = PaAssessmentUser::find($request->assessment_users_id);
                $paAssessmentUser->fill_by_staff = 1;
                $paAssessmentUser->total_score = $request->total_score;
                $paAssessmentUser->save();

                foreach ($request->unsurScores as $score) { //update aspek score
                    DB::table('assessment_unsur_scores')->insert(
                        ['assessment_users_id' => $request->assessment_users_id,
                        'unsur_id' => $score['unsur_id'],
                        'staff_score' => $score['staff_score'],
                        'bobot' => $score['bobot']]
                    );
                }
            }

        }else{

            foreach ($request->aspekScores as $score) {//update aspek score
                DB::table('aspek_scores')
                ->where('assessment_users_id', $request->assessment_users_id)
                ->where('aspek_id', $score['aspek_id'])
                ->update(['score' => $score['score']]);
            }

            foreach ($request->subAspekScores as $score) {//update subaspek score
                DB::table('sub_aspek_scores')
                ->where('assessment_users_id', $request->assessment_users_id)
                ->where('sub_aspek_id', $score['sub_aspek_id'])
                ->update(['score' => $score['score']]);
            }

              if($request->score_by==="atasan"){
                $paAssessmentUser = PaAssessmentUser::find($request->assessment_users_id);
                $paAssessmentUser->fill_by_atasan = 1;
                $paAssessmentUser->total_score = $request->total_score;
                $paAssessmentUser->note_atasan = $request->note_atasan;
                $paAssessmentUser->approval_staff = 0;
                $paAssessmentUser->save();

                foreach ($request->unsurScores as $score) {
                    DB::table('assessment_unsur_scores')
                    ->where('assessment_users_id', $request->assessment_users_id)
                    ->where('unsur_id', $score['unsur_id'])
                    ->update(['atasan_score' => $score['atasan_score']]);
                }
            }else{
                $paAssessmentUser = PaAssessmentUser::find($request->assessment_users_id);
                $paAssessmentUser->fill_by_staff = 1;
                $paAssessmentUser->total_score = $request->total_score;
                $paAssessmentUser->save();

                foreach ($request->unsurScores as $score) {
                    DB::table('assessment_unsur_scores')
                    ->where('assessment_users_id', $request->assessment_users_id)
                    ->where('unsur_id', $score['unsur_id'])
                    ->update(['staff_score' => $score['staff_score']]);
                }
            }
        }


    }

    public function exportExcel(Request $request){
        $result = $this->getByParams($request);

        $export = new ScoreExcellExport();
        $export->setData(AssessmentExportExcelResource::collection($result));

        return Excel::download($export, 'scores.xlsx');
    }

    public function exportDetailToPdf(Request $request){
        $assessmentUser = PaAssessmentUser::find($request->assessment_user_id);
        $jsonResponse = (new AssessmentDetailResource($assessmentUser))->toResponse(app('request'));


        $data =  json_decode(json_encode($jsonResponse->getData()), true);

        $pdf = PDF::loadView('assessment_detail', $data);
        return $pdf->download('assessment_detail.pdf');
    }

    public function staffApproval(Request $request){

        $assessmentUser = PaAssessmentUser::find($request->assessment_user_id);
        if($request->approval==2){
            $assessmentUser -> fill_by_atasan = 0;
        }
        $assessmentUser->approval_staff = $request->approval;
        $assessmentUser->save();
    }

    public function setEditAccess(Request $request){

        $assessmentUser = PaAssessmentUser::find($request->assessment_user_id);
        $assessmentUser -> fill_by_staff = $request->fill_by_staff;
        $assessmentUser->save();
    }

}
