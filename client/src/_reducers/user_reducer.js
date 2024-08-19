import { LOGIN_USER, REGISTER_USER } from "../_actions/types";

// (previousState, action) => nextState
// 이전 state와 action object를 받은 후에 nextState를 return한다

export default function (state={}, action) {
    switch(action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload}
        case REGISTER_USER:
            return {...state, register: action.payload}
        default:
            return state;
    }
} 