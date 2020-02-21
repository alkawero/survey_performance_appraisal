import {TOGGLE_LOCK_MENU,TOGGLE_LEFT_DRAWER,TOGGLE_SNACK_BAR, TOGGLE_LOADING_GLOBAL} from '../actions/Types';
import produce from "immer";
const uiState = {
    isLeftDrawerOpen : false,
    show_snack : false,
    snack_message : '',
    snack_variant : 'info',
    loadingGlobal:false,
    lockMenu:false,
    error_login:'',
    general_error:'',
    implementation_row_per_page:5,
    implementation_page:1,
    implementation_unmount:0,
    lastPage:''

}

export default function uiReducer(state=uiState,action){
    switch (action.type) {
        case TOGGLE_LEFT_DRAWER:
        return produce(state, draft =>{
            draft.isLeftDrawerOpen= action.payload
        })
        case TOGGLE_SNACK_BAR:
            return produce(state, draft =>{
                draft.show_snack    = action.payload.show
                draft.snack_message = action.payload.message
                draft.snack_variant = action.payload.variant
            })
        case TOGGLE_LOADING_GLOBAL:
            return produce(state, draft =>{
                draft.loadingGlobal= action.payload
            })
        case TOGGLE_LOCK_MENU:
            return produce(state, draft =>{
                draft.lockMenu= action.payload
            })
        case 'ERROR_LOGIN':
            return produce(state, draft =>{
                draft.error_login= action.payload
            })
        case 'GENERAL_ERROR':
            return produce(state, draft =>{
                draft.show_snack    = true
                draft.snack_message = action.payload
                draft.snack_variant = 'error'
            })   
        case 'SET_IMPL_ROW_PER_PAGE':
            return produce(state, draft =>{
                draft.implementation_row_per_page= action.payload
            })
        case 'SET_IMPL_PAGE':
            return produce(state, draft =>{
                draft.implementation_page= action.payload
            }) 
        case 'SET_IMPL_UNMOUNT':
            return produce(state, draft =>{
                draft.implementation_unmount= action.payload
            }) 
        case 'SET_LAST_PAGE':
            return produce(state, draft =>{
                draft.lastPage= action.payload
            })                                     
        default:
            return state
    }
}
