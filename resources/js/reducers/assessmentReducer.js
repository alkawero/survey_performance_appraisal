import produce from "immer";

const initialState = {
    //data_assessment
}

export default function assessmentReducer(state = initialState, action) {

    switch (action.type) {
      case "GET_DATA_DO_ASSESSMENT_SUCCESS":
        return produce(state, draft =>{
          draft.data_assessment= action.payload;
        })
      case "SET_ASPEK_FOR_ASSESSMENT":
        return produce(state, draft =>{
            draft.aspek_for_assessment= action.payload;
        })
      case "SET_MASTER_FOR_ASSESSMENT":
            return produce(state, draft =>{
                draft.master_for_assessment= action.payload;
            })
      case "SET_ASPEK_EDIT":
            return produce(state, draft =>{
                draft.aspek_to_edit= action.payload;
            })
    case "SET_SUBASPEK_EDIT":
        return produce(state, draft =>{
            draft.subaspek_to_edit= action.payload;
        })

    case "SET_UNSUR_EDIT":
        return produce(state, draft =>{
            draft.unsur_to_edit= action.payload;
        })

    case "SET_ASSESSMENT_DETAIL":
        return produce(state, draft =>{
            draft.assessment_detail= action.payload;
        })

      default :
        return state;
    }


  }
