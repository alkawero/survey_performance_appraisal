import {GET_UNITS_SUCCESS,SET_USER,GET_USERS_BYNAME_SUCCESS,GET_USERS_SUCCESS} from '../actions/Types';
import produce from "immer";

const initialState = {
    user    :{},
    usersByName   : [],
    allUsers :[],
    allUnits : [],
    userAdmins:[],
    allUsersUnit:[]
}

export default function userReducer(state = initialState, action) {

    switch (action.type) {
      case SET_USER:
        return produce(state, draft =>{
          draft.user= action.payload;
        })
      case GET_USERS_BYNAME_SUCCESS:
      return produce(state, draft =>{
          draft.usersByName= action.payload;
      })
      case GET_USERS_SUCCESS:
      return produce(state, draft =>{
          draft.allUsers= action.payload;
      })
      case 'GET_USERS_UNIT_SUCCESS':
      return produce(state, draft =>{
          draft.allUsersUnit= action.payload;
      })      
      case GET_UNITS_SUCCESS:
      return produce(state, draft =>{
          draft.allUnits= action.payload;
      })
      case 'LOGOUT':
      return produce(state, draft =>{
        draft.user= {};
      })
      case 'GET_USER_ADMIN_SUCCESS':
      return produce(state, draft =>{
        draft.userAdmins= action.payload;
      })

      default :
        return state;
    }


  }
