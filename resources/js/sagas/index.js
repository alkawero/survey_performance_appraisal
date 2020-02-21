import {GET_CRNT_SRV_IMPL,GET_ANSWER_SURVEYOR,GET_SURVEYOR_BYSRV,GET_EMP_OWNER_BYSRV,GET_UNIT_OWNER_BYSRV,GET_SURVEY_SELECT, GET_QUESTIONS_BYGROUP,UPDATE_SURVEY,GET_1SURVEY,SAVE_SURVEY_ANSWER,GET_SURVEY_TASK_DETAIL,GET_SURVEY_TASKS,ADD_SURVEY,GET_UNITS,GET_USERS,GET_USERS_BYNAME,DELETE_QUESTION,ADD_QUESTION,ADD_QUESTION_GROUP,GET_QUESTION_GROUPS,LOGIN,GET_SURVEYS,
    GET_SURVEY_TITTLE} from '../actions/Types'
import {setAssessmentDetail,getDataDoAssessmentSuccess,getUserNotAnsweringSuccess,getUsersByUnitSuccess,generalError,errorLogin,getUserAdminSuccess,getCrntSrvImplSuccess,getAnswerBySurveyorSuccess,getSurveyorsBySurveySuccess,getSurveySelectSuccess,getOneSurveySuccess,getSurveyTittleSuccess,lockMenu,getsurveyTaskDetailSuccess,getsurveyTasksSuccess,getUnitsSuccess,
getUsersByNameSuccess,getUsersSuccess,toggleSnackBar,getGroupSuccess,setUser,
getSurveySuccess,getQuestionsByGroupSuccess,loadingGlobal,getEmpOwnersBySurveySuccess,getUnitOwnersBySurveySuccess, setSelectedSurveyors} from '../actions'
import {call, put, takeEvery,takeLatest,all} from 'redux-saga/effects'
import {printPdf} from '../services/printPdf'

let api_url = 'api_url'
if(process.env.MIX_APP_ENV=='LOCAL'){
    api_url = process.env.MIX_APP_URL_LOCAL+'/api/'
}else
if(process.env.MIX_APP_ENV=='DEV'){
    api_url = process.env.MIX_APP_URL_DEV+'/api/'
}else
if(process.env.MIX_APP_ENV=='PROD'){
    api_url = process.env.MIX_APP_URL_PROD+'/api/'
}



export function* rootSaga(){
yield all([
    takeEvery(LOGIN,login),
    takeEvery(GET_SURVEYS,getSurveys),
    takeEvery(GET_QUESTIONS_BYGROUP,getQuestionsByGroup),
    takeEvery(GET_QUESTION_GROUPS,getQuestionGroups),
    takeEvery(ADD_QUESTION_GROUP,addQuestionGroup),
    takeEvery(ADD_QUESTION,addQuestion),
    takeEvery(DELETE_QUESTION,deleteQuestion),
    takeLatest(GET_USERS_BYNAME,getUsersByName),
    takeEvery(GET_USERS,getUsers),
    takeEvery('GET_USERS_UNIT',getUsersByUnit),
    takeEvery(GET_UNITS,getUnits),
    takeEvery(GET_SURVEY_TASKS,getsurveyTasks),
    takeEvery(GET_SURVEY_TASK_DETAIL,getSurveyTaskDetail),
    takeEvery(GET_SURVEY_TITTLE,getSurveyTittle),
    takeLatest(ADD_SURVEY,addSurvey),
    takeLatest(SAVE_SURVEY_ANSWER,saveSurveyAnswer),
    takeEvery(GET_1SURVEY,getOneSurvey),
    takeLatest(UPDATE_SURVEY,updateSurvey),
    takeLatest(GET_SURVEY_SELECT,getSurveySelect),
    takeLatest(GET_EMP_OWNER_BYSRV,getEmpOwnersBySurvey),
    takeLatest(GET_UNIT_OWNER_BYSRV,getUnitOwnersBySurvey),
    takeEvery(GET_SURVEYOR_BYSRV,getSurveyorsBySurvey),
    takeLatest(GET_ANSWER_SURVEYOR,getAnswerBySurveyor),
    takeLatest(GET_CRNT_SRV_IMPL,getCrntSrvImpl),
    takeEvery('GET_USER_ADMIN',getUserAdmins),
    takeLatest('ADD_USER_ADMIN',addUserAdmin),
    takeLatest('DELETE_USER_ADMIN',deleteUserAdmin),
    takeLatest('EXPORT_PDF',exportPdf),
    takeLatest('EDIT_SURVEY_IMPL',editSurveyImplementation),
    takeLatest('ADD_SURVEY_IMPL',addSurveyImplementation),
    takeLatest('TGL_ACTIVE_SURV_IMPL',toggleActiveSurveyImpl),
    takeLatest('TGL_ACTIVE_SURV',toggleActiveSurvey),
    takeLatest('TGL_ACTIVE_QUESTION',toggleActiveQuestion),
    takeEvery('UPDATE_QUESTION_GROUP',updateQuestionGroup),
    takeLatest('DELETE_QUESTION_GROUP',deleteQuestionGroup),
    takeEvery('GET_SURVEYORS_BY_UNIT', getSurveyorsByUnit),
    takeEvery('GET_USER_NOT_ANSWER', getUserNotAnswering),
    takeEvery('GET_DATA_DO_ASSESSMENT', getDataDoAssessment),
    takeEvery('GET_ASSESSMENT_DETAIL', getAssessmentDetail),

])
}

export function* login(action){
yield put(lockMenu(true));
    try{
        const response = yield call([axios,axios.post],api_url+'login',action.payload);

        if(response.data==''){
            yield put(errorLogin('User not found'));
        }else{
            yield put(setUser(response.data));
            yield put(lockMenu(false));
        }
    }catch(error){
        console.log('error in saga login()')
        yield put(generalError('ups, something wrong happened, please call the administrator'))
    }
}

export function* saveSurveyAnswer(action){
yield put(loadingGlobal(true));
try{
    yield call([axios,axios.post],api_url+'survey/task/answer',action.payload);
    yield put(loadingGlobal(false));
    yield put(toggleSnackBar({show:true,variant:'success',message:'Your answer saved successfully'}))
}
catch(error){
    console.log('error in saga saveSurveyAnswer()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}
yield put(loadingGlobal(false));
}

export function* getSurveyTaskDetail(action){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],api_url+'survey/task/'+action.payload);
    yield put(getsurveyTaskDetailSuccess(response.data));
}
catch(error){
    console.log('error in saga getSurveyTaskDetail()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}

export function* getCrntSrvImpl(action){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],api_url+'survey/implementation/'+action.payload);
    yield put(getCrntSrvImplSuccess(response.data));
}
catch(error){
    console.log('error in saga getCrntSrvImpl()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}
yield put(loadingGlobal(false));
}


export function* addQuestionGroup(action){
yield put(loadingGlobal(true));
try{
    yield call([axios,axios.post],api_url+'group',action.payload);
    yield getQuestionGroups();
    yield put(toggleSnackBar({show:true,variant:'success',message:'New group added successfully'}))
}
catch(error){
    console.log('error in saga addQuestionGroup()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}
yield put(loadingGlobal(false));
}

export function* addQuestion(action){
yield put(loadingGlobal(true));
try{
    yield call([axios,axios.post],api_url+'question',action.payload);
    yield put(loadingGlobal(false));
    yield put(toggleSnackBar({show:true,variant:'success',message:'New Question added successfully'}))
}
catch(error){
    console.log('error in saga addQuestion()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}
yield put(loadingGlobal(false));
}

export function* addSurvey(action){
yield put(loadingGlobal(true));
try{
    yield call([axios,axios.post],api_url+'survey',action.payload);
    yield put(loadingGlobal(false));
    yield put(toggleSnackBar({show:true,variant:'success',message:'Saved  successfully'}))
}
catch(error){
    console.log('error in saga addSurvey()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}
yield put(loadingGlobal(false));
}

export function* editSurveyImplementation(action){
yield put(loadingGlobal(true));
try{
    yield call([axios,axios.patch],api_url+'survey/implementation',action.payload);
    yield put(loadingGlobal(false));
    yield put(toggleSnackBar({show:true,variant:'success',message:'Saved  successfully'}))
}
catch(error){
    console.log('error in saga editSurveyImplementation()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}
yield put(loadingGlobal(false));
}

export function* addSurveyImplementation(action){
yield put(loadingGlobal(true));
try{
    yield call([axios,axios.post],api_url+'survey/implementation',action.payload);
    yield put(loadingGlobal(false));
    yield put(toggleSnackBar({show:true,variant:'success',message:'Saved  successfully'}))
}
catch(error){
    console.log('error in saga addSurveyImplementation()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}
yield put(loadingGlobal(false));
}





export function* updateSurvey(action){
yield put(loadingGlobal(true));
try{
    yield call([axios,axios.patch],api_url+'survey',action.payload);
    yield put(loadingGlobal(false));
    yield put(toggleSnackBar({show:true,variant:'success',message:'The Survey updated successfully'}))
}
catch(error){
    console.log('error in saga updateSurvey()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}
yield put(loadingGlobal(false));
}



export function* deleteQuestion(action){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.delete],api_url+'question/'+action.payload.questionId);
    if(_.isNumber(response.data)){
        yield put(toggleSnackBar({show:true,variant:'error',message:'Can not delete the question that already answered by surveyor'}))
    }else{
        yield put(toggleSnackBar({show:true,variant:'success',message:'The question deleted successfully'}))
    }

    yield getQuestionsByGroup({payload:action.payload.groupId})
}
catch(error){
    console.log('error in saga deleteQuestion()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}
yield put(loadingGlobal(false));
}

export function* deleteUserAdmin(action){
yield put(loadingGlobal(true));
try{
    yield call([axios,axios.delete],api_url+'user/admin/'+action.payload);
    yield put(toggleSnackBar({show:true,variant:'info',message:'The user not become admin anymore'}))
    yield getUserAdmins();
}
catch(error){
    console.log('error in saga deleteUserAdmin()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}
yield put(loadingGlobal(false));
}



export function* getQuestionGroups(){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],api_url+'group');
    yield put(getGroupSuccess(response.data));
}
catch(error){
    console.log('error in saga getQuestionGroups()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}

export function* getOneSurvey(action){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],api_url+'survey/'+action.payload);
    yield put(getOneSurveySuccess(response.data));
}
catch(error){
    console.log('error in saga getOneSurvey()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}

export function* getSurveys(startFrom){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],api_url+'survey/page/'+startFrom);
    yield put(getSurveySuccess(response.data));
}
catch(error){
    console.log('error in saga getSurveys()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}

export function* getSurveySelect(){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],api_url+'survey/select/');
    yield put(getSurveySelectSuccess(response.data));
}
catch(error){
    console.log('error in saga getSurveySelect()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}

export function* getEmpOwnersBySurvey(action){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],`${api_url}survey/${action.payload}/emp/`);
    yield put(getEmpOwnersBySurveySuccess(response.data));
}
catch(error){
    console.log('error in saga getEmpOwnersBySurvey()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}

export function* getUnitOwnersBySurvey(action){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],`${api_url}survey/${action.payload}/unit/`);
    yield put(getUnitOwnersBySurveySuccess(response.data));
}
catch(error){
    console.log('error in saga getUnitOwnersBySurvey()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}


export function* getSurveyorsBySurvey(action){
const param = action.payload
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],`${api_url}survey/surveyor/${param.surveyId}/${param.unitId}/${param.empId}/${param.from}/${param.until}/`);
    yield put(getSurveyorsBySurveySuccess(response.data));
}
catch(error){
    console.log('error in saga getSurveyorsBySurvey()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}

export function* getAnswerBySurveyor(action){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],`${api_url}survey/surveyor/answer/${action.payload}/`);
    yield put(getAnswerBySurveyorSuccess(response.data));
}
catch(error){
    console.log('error in saga getAnswerBySurveyor()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

}

export function* getUserNotAnswering(action){
    yield put(loadingGlobal(true));
    try{
        const response = yield call([axios,axios.get],`${api_url}survey/incomplete/user`);
        yield put(getUserNotAnsweringSuccess(response.data));
    }
    catch(error){
        console.log('error in saga getUserNotAnswering()')
        yield put(generalError('ups, something wrong happened, please call the administrator'))
    }

yield put(loadingGlobal(false));
}


export function* getDataDoAssessment(action){
    yield put(loadingGlobal(true));
    const params={assessment_user_id:action.payload}
    try{
        const response = yield call([axios,axios.get],`${api_url}pa/assessment/do`,{params:params});
        yield put(getDataDoAssessmentSuccess(response.data));
    }
    catch(error){
        console.log('error in saga getDataDoAssessment()')
        yield put(generalError('ups, something wrong happened, please call the administrator'))
    }

yield put(loadingGlobal(false));
}

export function* getAssessmentDetail(action){
    yield put(loadingGlobal(true));
    const params={assessment_user_id:action.payload}
    try{
        const response = yield call([axios,axios.get],`${api_url}pa/assessment/detail`,{params:params});
        yield put(setAssessmentDetail(response.data));
    }
    catch(error){
        console.log('error in saga getAssessmentDetail()')
        yield put(generalError('ups, something wrong happened, please call the administrator'))
    }

yield put(loadingGlobal(false));
}

export function* getSurveyTittle(startFrom){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],api_url+'survey/tittle/'+startFrom);
    yield put(getSurveyTittleSuccess(response.data));
}
catch(error){
    console.log('error in saga getSurveyTittle()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}


export function* getQuestionsByGroup(action){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],api_url+'question/group/'+action.payload);
    yield put(getQuestionsByGroupSuccess(response.data));
}
catch(error){
    console.log('error in saga getQuestionsByGroup()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}

export function* getsurveyTasks(action){
const param = action.payload
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],`${api_url}survey/task/user/${param.surveyorId}/${param.surveyId}/${param.ownerName}/${param.pagination}?page=${param.page}`);
    yield put(getsurveyTasksSuccess(response.data));
}
catch(error){
    console.log('error in saga getsurveyTasks()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}


export function* getUsersByName(action){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],api_url+'user/name/'+action.payload);
    yield put(getUsersByNameSuccess(response.data));
}
catch(error){
    console.log('error in saga getUsersByName()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}

export function* getUsers(){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],api_url+'user');
    yield put(getUsersSuccess(response.data));
}
catch(error){
    console.log('error in saga getUsers()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}

export function* getUsersByUnit(action){
    yield put(loadingGlobal(true));
    try{
        const response = yield call([axios,axios.get],api_url+'user/unit/'+action.payload);
        yield put(getUsersByUnitSuccess(response.data));
    }
    catch(error){
        console.log('error in saga getUsersByUnit()')
        yield put(generalError('ups, something wrong happened, please call the administrator'))
    }

    yield put(loadingGlobal(false));
    }


    export function* getSurveyorsByUnit(action){
        yield put(loadingGlobal(true));

        try{
            const response = yield call([axios,axios.get],api_url+'user/unit/'+action.payload);
            if(!_.isEmpty(response.data)){
                    const surveyors = response.data.map(user => ({label:user.emp_name, value:user.emp_id}))
                    yield put(setSelectedSurveyors(surveyors));
                }

        }
        catch(error){
            console.log('error in saga getSurveyorsByUnit()')
            yield put(generalError('ups, something wrong happened, please call the administrator'))
        }

        yield put(loadingGlobal(false));
        }


export function* getUserAdmins(){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],api_url+'user/admin');
    yield put(getUserAdminSuccess(response.data));
}
catch(error){
    console.log('error in saga getUserAdmins()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}
yield put(loadingGlobal(false));
}

export function* addUserAdmin(action){
yield put(loadingGlobal(true));
try{
    yield call([axios,axios.post],api_url+'user/admin',action.payload);
    yield getUserAdmins();
}
catch(error){
    console.log('error in saga addUserAdmin()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}
yield put(loadingGlobal(false));
}


export function* getUnits(){
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],api_url+'unit');
    yield put(getUnitsSuccess(response.data));
}
catch(error){
    console.log('error in saga getUnits()')
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}

export function* exportPdf(action){
const param = action.payload
yield put(loadingGlobal(true));
try{
    const response = yield call([axios,axios.get],`${api_url}survey/summary/${param.surveyId}/${param.ownerType}/${param.ownerId}/${param.summaryType}/${param.validFrom}/${param.validUntil}`);
    //console.log(response)
    yield printPdf(response.data);
}
catch(error){
    console.log('error in saga exportPdf() '+error)
    yield put(generalError('ups, something wrong happened, please call the administrator'))
}

yield put(loadingGlobal(false));
}


export function* toggleActiveSurveyImpl(action){
    const payload = action.payload
    yield put(loadingGlobal(true));
    try{
        const response = yield call([axios,axios.patch],api_url+'survey/implementation/toggle/'+payload.surveyTrxId);
        if(response.data!==''){
            yield put(toggleSnackBar({show:true,variant:'info',message:response.data}))
        }
        const param = {surveyorId:'admin',surveyId:payload.surveyId,ownerName:payload.ownerName,page:payload.page,pagination:payload.pagination}
        yield getsurveyTasks({payload:param})
    }
    catch(error){
        console.log('error in saga toggleActiveSurveyImpl()')
        yield put(generalError('ups, something wrong happened, please call the administrator'))
    }
    yield put(loadingGlobal(false));
}

export function* toggleActiveSurvey(action){
    yield put(loadingGlobal(true));
    try{
        yield call([axios,axios.patch],api_url+'survey/toggle/'+action.payload);
        yield getSurveys(0)
    }
    catch(error){
        console.log('error in saga toggleActiveSurvey()')
        yield put(generalError('ups, something wrong happened, please call the administrator'))
    }
    yield put(loadingGlobal(false));
}

export function* toggleActiveQuestion(action){
    const payload = action.payload
    yield put(loadingGlobal(true));
    try{
        const response = yield call([axios,axios.patch],api_url+'question/toggle/'+payload.questionId);
        yield getQuestionsByGroup({payload:payload.groupId})
    }
    catch(error){
        console.log('error in saga toggleActiveQuestion()')
        yield put(generalError('ups, something wrong happened, please call the administrator'))
    }

    yield put(loadingGlobal(false));
}


export function* updateQuestionGroup(action){
    yield put(loadingGlobal(true));
    try{
        yield call([axios,axios.patch],api_url+'group',action.payload);
        yield put(toggleSnackBar({show:true,variant:'success',message:'saved successfully'}))
        yield getQuestionGroups()
    }
    catch(error){
        console.log('error in saga updateQuestionGroup()')
        yield put(generalError('ups, something wrong happened, please call the administrator'))
    }
    yield put(loadingGlobal(false));
}

export function* deleteQuestionGroup(action){
    yield put(loadingGlobal(true));
    try{
        const response = yield call([axios,axios.delete],api_url+'group/'+action.payload);

        if(_.isNumber(response.data)){
            yield put(toggleSnackBar({show:true,variant:'error',message:'The groups is used by another survey or question'}))
        }
        else if(!_.isNumber(response.data) && !response.data.includes('error')){
            yield put(toggleSnackBar({show:true,variant:'success',message:'The groups is deleted'}))
        }
        yield getQuestionGroups()
    }
    catch(error){
        console.log('error in saga deleteQuestionGroup()')
        yield put(generalError('ups, something wrong happened, please call the administrator'))
    }
    yield put(loadingGlobal(false));
}










