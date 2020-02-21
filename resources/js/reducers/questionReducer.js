import {GET_QUESTIONS_BYGROUP_SUCCESS,GET_GROUP_SUCCESS} from '../actions/Types';
import produce from "immer";

const questionState = {
  questionsByGroup  : [],
  questionGroups : []

}

export default function questionReducer(state = questionState, action) {

    switch (action.type) {
      case GET_QUESTIONS_BYGROUP_SUCCESS:
        return produce(state, draft =>{
          draft.questionsByGroup= action.payload
        })
        case GET_GROUP_SUCCESS:
        return produce(state, draft =>{
          draft.questionGroups= action.payload
        })
        case 'CLEAR_QUESTION':
        return produce(state, draft =>{
          draft.questionsByGroup= []
        })
        case 'CLEAR_QUESTION_GROUP':
        return produce(state, draft =>{
          draft.questionGroups = []
        })

        

      default :
        return state;
    }


  }
