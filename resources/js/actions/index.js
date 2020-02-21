import {GET_EMP_OWNER_BYSRV, GET_EMP_OWNER_BYSRV_SUCCESS,GET_UNIT_OWNER_BYSRV,GET_UNIT_OWNER_BYSRV_SUCCESS,GET_QUESTIONS_BYGROUP_SUCCESS,GET_QUESTIONS_BYGROUP,RESET_CURRENT_SURVEY,UPDATE_SURVEY,GET_1SURVEY_SUCCESS,GET_1SURVEY,GET_SURVEY_TITTLE_SUCCESS,GET_SURVEY_TITTLE,SAVE_SURVEY_ANSWER,TOGGLE_LOCK_MENU,GET_SURVEY_TASK_DETAIL,GET_SURVEY_TASK_DETAIL_SUCCESS,ADD_SURVEY,GET_UNITS_SUCCESS,GET_UNITS,DELETE_QUESTION,ADD_QUESTION,ADD_QUESTION_GROUP,GET_GROUP_SUCCESS,GET_USERS_BYNAME_SUCCESS,
    GET_QUESTION_GROUPS,LOGIN,GET_USERS_BYNAME,
    SET_USER,GET_SURVEY_TASKS,GET_SURVEY_TASK_SUCCESS,
    GET_SURVEYS, GET_SURVEY_SUCCESS, TOGGLE_LEFT_DRAWER, TOGGLE_SNACK_BAR,
    ADD, SUBTRACT, GET_USERS, GET_USERS_SUCCESS, TOGGLE_LOADING_GLOBAL,
    GET_SURVEY_SELECT_SUCCESS,GET_SURVEY_SELECT,GET_SURVEYOR_BYSRV_SUCCESS,GET_SURVEYOR_BYSRV,GET_ANSWER_SURVEYOR_SUCCESS,
    GET_ANSWER_SURVEYOR,GET_CRNT_SRV_IMPL_SUCCESS,GET_CRNT_SRV_IMPL } from './Types';

//for ui
export function toggleLeftDrawer(payload){
    return{type:TOGGLE_LEFT_DRAWER, payload:payload}
}
export function toggleSnackBar(payload){
    return{type:TOGGLE_SNACK_BAR, payload:payload}
}
export function loadingGlobal(payload){
    return{type:TOGGLE_LOADING_GLOBAL, payload:payload}
}
export function lockMenu(payload){
    return{type:TOGGLE_LOCK_MENU, payload:payload}
}




//for user
export function login(loginData){
    return{type:LOGIN, payload:loginData}
}
export function logout(){
    return{type:'LOGOUT'}
}



export function setUser(user){
    return{type:SET_USER, payload:user}
}

//for math
export function add(){
    return{type:ADD, payload:1}
}

export function subtract(){
    return{type:SUBTRACT, payload:1}
}

//for saga


export function getUsersByName(data){
    return{type:GET_USERS_BYNAME, payload:data}
}
export function getUsersByNameSuccess(data){
    return{type:GET_USERS_BYNAME_SUCCESS, payload:data}
}

export function getUsers(){
    return{type:GET_USERS, payload:1}
}

export function getUsersSuccess(data){
    return{type:GET_USERS_SUCCESS, payload:data}
}

export function getUsersByUnit(data){
    return{type:'GET_USERS_UNIT', payload:data}
}

export function getUsersByUnitSuccess(data){
    return{type:'GET_USERS_UNIT_SUCCESS', payload:data}
}

export function getUserAdmins(){
    return{type:'GET_USER_ADMIN'}
}

export function deleteUserAdmin(data){
    return{type:'DELETE_USER_ADMIN',payload:data}
}



export function getUserAdminSuccess(data){
    return{type:'GET_USER_ADMIN_SUCCESS', payload:data}
}

export function addUserAdmin(employee){
    return{type:'ADD_USER_ADMIN',payload:employee}
}




export function getUnits(){
    return{type:GET_UNITS, payload:1}
}

export function getUnitsSuccess(data){
    return{type:GET_UNITS_SUCCESS, payload:data}
}


export function getOneSurvey(id){
    return{type:GET_1SURVEY, payload:id}
}

export function getOneSurveySuccess(data){
    return{type:GET_1SURVEY_SUCCESS, payload:data}
}


export function getSurveys(){
    return{type:GET_SURVEYS, payload:1}
}

export function getSurveySuccess(data){
    return{type:GET_SURVEY_SUCCESS, payload:data}
}


export function getCrntSrvImpl(data){
    return{type:GET_CRNT_SRV_IMPL, payload:data}
}

export function getCrntSrvImplSuccess(data){
    return{type:GET_CRNT_SRV_IMPL_SUCCESS, payload:data}
}

export function resetCrntSrvImpl(){
    return{type:GET_CRNT_SRV_IMPL_SUCCESS, payload:[]}
}



export function getSurveySelect(){
    return{type:GET_SURVEY_SELECT}
}

export function getSurveySelectSuccess(data){
    return{type:GET_SURVEY_SELECT_SUCCESS, payload:data}
}

export function getEmpOwnersBySurvey(data){
    return{type:GET_EMP_OWNER_BYSRV, payload:data}
}

export function getEmpOwnersBySurveySuccess(data){
    return{type:GET_EMP_OWNER_BYSRV_SUCCESS, payload:data}
}

export function getUnitOwnersBySurvey(data){
    return{type:GET_UNIT_OWNER_BYSRV, payload:data}
}

export function getUnitOwnersBySurveySuccess(data){
    return{type:GET_UNIT_OWNER_BYSRV_SUCCESS, payload:data}
}

export function getSurveyorsBySurvey(data){
    return{type:GET_SURVEYOR_BYSRV, payload:data}
}

export function getSurveyorsBySurveySuccess(data){
    return{type:GET_SURVEYOR_BYSRV_SUCCESS, payload:data}
}

export function getAnswerBySurveyor(data){
    return{type:GET_ANSWER_SURVEYOR, payload:data}
}

export function getAnswerBySurveyorSuccess(data){
    return{type:GET_ANSWER_SURVEYOR_SUCCESS, payload:data}
}






export function addSurvey(data){
    return{type:ADD_SURVEY, payload:data}
}

export function editSurveyImplementation(data){
    return{type:'EDIT_SURVEY_IMPL', payload:data}
}

export function addSurveyImplementation(data){
    return{type:'ADD_SURVEY_IMPL', payload:data}
}


export function updateSurvey(data){
    return{type:UPDATE_SURVEY, payload:data}
}


export function getQuestionsByGroup(groupId){
    return{type:GET_QUESTIONS_BYGROUP, payload:groupId}
}

export function getQuestionsByGroupSuccess(data){
    return{type:GET_QUESTIONS_BYGROUP_SUCCESS, payload:data}
}

export function getQuestionGroups(){
    return{type:GET_QUESTION_GROUPS, payload:1}
}



export function getGroupSuccess(data){
    return{type:GET_GROUP_SUCCESS, payload:data}
}

export function saveSurveyAnswer(data){
    return{type:SAVE_SURVEY_ANSWER, payload:data}
}

export function getsurveyTasks(data){
    return{type:GET_SURVEY_TASKS, payload:data}
}

export function getsurveyTasksSuccess(data){
    return{type:GET_SURVEY_TASK_SUCCESS, payload:data}
}

export function getSurveyTittle(userId){
    return{type:GET_SURVEY_TITTLE, payload:userId}
}

export function getSurveyTittleSuccess(data){
    return{type:GET_SURVEY_TITTLE_SUCCESS, payload:data}
}


export function getsurveyTaskDetail(survey_id){
    return{type:GET_SURVEY_TASK_DETAIL, payload:survey_id}
}

export function getsurveyTaskDetailSuccess(data){
    return{type:GET_SURVEY_TASK_DETAIL_SUCCESS, payload:data}
}


export function addQuestionGroup(data){
    return{type:ADD_QUESTION_GROUP, payload:data}
}

export function addQuestion(data){
    return{type:ADD_QUESTION, payload:data}
}

export function deleteQuestion(data){
    return{type:DELETE_QUESTION, payload:data}
}


export function resetCurrentSurvey(){
    return{type:RESET_CURRENT_SURVEY}
}

export function exportPdf(data){
    return{type:'EXPORT_PDF', payload:data}
}

export function toggleActiveSurveyImpl(data){
    return{type:'TGL_ACTIVE_SURV_IMPL', payload:data}
}

export function toggleActiveSurvey(data){
    return{type:'TGL_ACTIVE_SURV', payload:data}
}

export function toggleActiveQuestion(data){
    return{type:'TGL_ACTIVE_QUESTION', payload:data}
}

export function clearQuestion(){
    return{type:'CLEAR_QUESTION'}
}

export function clearQuestionGroup(){
    return{type:'CLEAR_QUESTION_GROUP'}
}

export function clearSurvey(){
    return{type:'CLEAR_SURVEY'}
}

export function clearSurveyTask(){
    return{type:'CLEAR_SURVEY_TASK'}
}

export function errorLogin(data){
    return{type:'ERROR_LOGIN',payload:data}
}

export function generalError(msg){
    return{type:'GENERAL_ERROR',payload:msg}
}

export function updateQuestionGroup(data){
    return{type:'UPDATE_QUESTION_GROUP',payload:data}
}

export function deleteQuestionGroup(data){
    return{type:'DELETE_QUESTION_GROUP',payload:data}
}

export function setSelectedSurveyors(data){
    return{type:'SET_SELECTED_SURVEYORS',payload:data}
}

export function getSurveyorsByUnit(data){
    return{type:'GET_SURVEYORS_BY_UNIT',payload:data}
}

export function getUserNotAnswering(){
    return{type:'GET_USER_NOT_ANSWER'}
}

export function getUserNotAnsweringSuccess(data){
    return{type:'GET_USER_NOT_ANSWER_SUCCESS',payload:data}
}

export function setImplRowPerPage(data){
    return{type:'SET_IMPL_ROW_PER_PAGE',payload:data}
}

export function setImplPage(data){
    return{type:'SET_IMPL_PAGE',payload:data}
}

export function setImplUnmount(data){
    return{type:'SET_IMPL_UNMOUNT',payload:data}
}

export function setLastPage(data){
    return{type:'SET_LAST_PAGE',payload:data}
}

export function getDataDoAssessment(data){
    return{type:'GET_DATA_DO_ASSESSMENT',payload:data}
}

export function getDataDoAssessmentSuccess(data){
    return{type:'GET_DATA_DO_ASSESSMENT_SUCCESS',payload:data}
}

export function setAspekForAssessment(data){
    return{type:'SET_ASPEK_FOR_ASSESSMENT',payload:data}
}

export function setmasterForAssessment(data){
    return{type:'SET_MASTER_FOR_ASSESSMENT',payload:data}
}

export function setAspekEdit(data){
    return{type:'SET_ASPEK_EDIT',payload:data}
}

export function setSubAspekEdit(data){
    return{type:'SET_SUBASPEK_EDIT',payload:data}
}

export function setUnsurEdit(data){
    return{type:'SET_UNSUR_EDIT',payload:data}
}

export function getAssessmentDetail(data){
    return{type:'GET_ASSESSMENT_DETAIL',payload:data}
}

export function setAssessmentDetail(data){
    return{type:'SET_ASSESSMENT_DETAIL',payload:data}
}
























