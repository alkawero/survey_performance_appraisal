import produce from "immer";
const systemState = {
    maintenance:0
}

export default function systemReducer(state=systemState, action){
    switch (action.type) {
        case "SET_SYSTEM_MAINTENANCE":
        return produce(state, draft =>{
            draft.maintenance = action.payload
        })
        default:
            return state
    }
}
