import { combineReducers } from 'redux';
import system from './systemReducer';
import user from './userReducer';
import ui from './uiReducer';
import survey from './surveyReducer';
import question from './questionReducer';
import assessment from './assessmentReducer';

const rootReducer = combineReducers({
    system,
    user,
    ui,
    survey,
    question,
    assessment
  });
export default rootReducer;
