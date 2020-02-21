import {GET_CRNT_SRV_IMPL_SUCCESS,GET_ANSWER_SURVEYOR_SUCCESS,GET_SURVEYOR_BYSRV_SUCCESS,GET_EMP_OWNER_BYSRV_SUCCESS,GET_UNIT_OWNER_BYSRV_SUCCESS,GET_SURVEY_SELECT_SUCCESS,RESET_CURRENT_SURVEY ,GET_1SURVEY_SUCCESS,GET_SURVEY_TITTLE_SUCCESS,GET_SURVEY_SUCCESS,GET_SURVEY_TASK_SUCCESS,GET_SURVEY_TASK_DETAIL_SUCCESS} from '../actions/Types';
import produce from "immer";

const initialState = {
    surveyPaginate  : {},
    currentSurvey:{},
    surveyTasks : [],
    currentTask : {},
    allSurveyTitles : [],
    surveyForSelect :[],
    empOwnersBySurvey:[],
    unitOwnersBySurvey:[],
    surveyorsBySurvey:[],
    surveyorAnswer:[],
    crntSurveyImpl:[],
    selectedSurveyors:[],
    incompleteUsers:[]

}

export default function surveyReducer(state = initialState, action) {

    switch (action.type) {
        case GET_SURVEY_SUCCESS:
        return produce(state, draft =>{
          draft.surveyPaginate= action.payload
        })
        case GET_1SURVEY_SUCCESS:
        return produce(state, draft =>{
          draft.currentSurvey= action.payload
        })
        case GET_SURVEY_TASK_SUCCESS:
        return produce(state, draft =>{
          draft.surveyTasks= action.payload
        })
        case GET_SURVEY_TASK_DETAIL_SUCCESS:
        return produce(state, draft =>{
          draft.currentTask= action.payload
        })
        case GET_SURVEY_TITTLE_SUCCESS:
        return produce(state, draft =>{
          draft.allSurveyTitles= action.payload
        })
        case GET_SURVEY_SELECT_SUCCESS:
        return produce(state, draft =>{
          draft.surveyForSelect= action.payload
        })
        case GET_EMP_OWNER_BYSRV_SUCCESS:
        return produce(state, draft =>{
          draft.empOwnersBySurvey= action.payload
        })
        case GET_UNIT_OWNER_BYSRV_SUCCESS:
        return produce(state, draft =>{
          draft.unitOwnersBySurvey= action.payload
        })
        case GET_SURVEYOR_BYSRV_SUCCESS:
        return produce(state, draft =>{
          draft.surveyorsBySurvey= action.payload
        })
        case GET_ANSWER_SURVEYOR_SUCCESS:
        return produce(state, draft =>{
          draft.surveyorAnswer= action.payload
        })
        case GET_CRNT_SRV_IMPL_SUCCESS:
        return produce(state, draft =>{
          draft.crntSurveyImpl= action.payload
        })
        case RESET_CURRENT_SURVEY:
        return produce(state, draft =>{
          draft.currentSurvey= {}
        })
        case 'CLEAR_SURVEY':
        return produce(state, draft =>{
          draft.surveyPaginate= []
        })
        case 'CLEAR_SURVEY_TASK':
        return produce(state, draft =>{
          draft.surveyTasks= []
        })
        case 'SET_SELECTED_SURVEYORS':
        return produce(state, draft =>{
          draft.selectedSurveyors= action.payload
        })
        case 'GET_USER_NOT_ANSWER_SUCCESS':
        return produce(state, draft =>{
          draft.incompleteUsers= action.payload
        })

      default :
        return state;
    }


  }
