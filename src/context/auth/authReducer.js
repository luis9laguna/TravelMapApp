import Cookies from 'js-cookie'
import { USER_AUTH, FORM_AUTH, LOG_OUT, UPDATE_USER, UPDATE_PINS } from "../../utils/types";

const reducer = (state, action) => {
    switch (action.type) {

        case FORM_AUTH:
            Cookies.set('token', action.payload.token, { expires: 1 })
            return {
                ...state,
                user: {
                    name: action.payload.user.name,
                    email: action.payload.user.email,
                    pins: action.payload.user.pins || [],
                    favs: action.payload.user.favs || [],
                },
                isLoggedIn: true
            }

        case USER_AUTH:
            return {
                ...state,
                user: {
                    name: action.payload.name,
                    email: action.payload.email,
                    pins: action.payload.pins,
                    favs: action.payload.favs || [],
                },
                isLoggedIn: true,
                isLoading: false
            }
        case UPDATE_USER:
            return {
                ...state,
                user: {
                    ...state.user,
                    name: action.payload
                },
            }

        case LOG_OUT:
            Cookies.remove('token')
            return {
                ...state,
                user: {
                    name: null,
                    email: null,
                    pins: [],
                    favs: []
                },
                isLoggedIn: false,
                isLoading: false
            }
        case UPDATE_PINS:
            let newPins = state.user[action.payload.type].filter(pin => pin._id !== action.payload.pin._id);

            if (!action.payload.dltPin) {
                newPins = [...newPins, action.payload.pin]
            }
            return {
                ...state,
                user: {
                    ...state.user,
                    [action.payload.type]: newPins
                }

            }

        default:
            return { ...state };
    }
}

export default reducer;