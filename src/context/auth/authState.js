import { useCallback, useEffect, useReducer } from "react";
import authContext from "./authContext";
import authReducer from "./authReducer";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify'
import clientAxios from '../../config/axios'

import { USER_AUTH, FORM_AUTH, LOG_OUT, UPDATE_USER, UPDATE_PINS } from "../../utils/types";

const AuthState = ({ children }) => {


    //ROUTER

    const initialState = {
        user: {
            name: null,
            email: null,
            pins: [],
            favs: []
        },
        isLoggedIn: false,
        isLoading: true
    }

    const [state, dispatch] = useReducer(authReducer, initialState)

    const userAuth = useCallback(async () => {

        if (!Cookies.get('token')) {
            logOut();
            return;
        }

        try {
            const response = await clientAxios.get('/user', { headers: { Authorization: Cookies.get('token') } })
            if (response.data.ok) {
                dispatch({
                    type: USER_AUTH,
                    payload: response.data.user
                })
            } else logOut()
        } catch (error) {
            toast.error('An error occured, please try later')
            logOut()
        }
    }, [])

    //GET USER INFO
    useEffect(() => { userAuth() }, [userAuth])


    const userRegister = async data => {

        try {
            const response = await clientAxios.post('user', data)
            if (response.data.ok) {
                dispatch({
                    type: FORM_AUTH,
                    payload: {
                        user: response.data.user,
                        token: response.data.token
                    }
                })
                toast.success('Your registration has been successful!')
            } else {
                if (response.data.message === "This email has an account already") {
                    toast.error(response.data.message)
                } else {
                    toast.error('An error occured, please try later')
                }
            }
        } catch (error) {
            toast.error('An error occured, please try later')
        }
    }


    const logIn = async data => {
        try {
            const response = await clientAxios.post('auth/login', data)
            if (response.data.ok) {
                dispatch({
                    type: FORM_AUTH,
                    payload: {
                        user: response.data.user,
                        token: response.data.token
                    }
                })
                toast.success('You have successfully logged in!')
            } else {
                if (response.data.message === "Invalid Email or Password") {
                    toast.error(response.data.message)
                } else {
                    toast.error('An error occured, please try later')

                }
            }
        } catch (error) {
            toast.error('An error occured, please try later')
        }
    }

    const logInGoogle = async token => {
        const asd = await clientAxios.post('auth/google', token)
        console.log(asd)
        // if (response.ok) {
        //     dispatch({
        //         type: FORM_AUTH,
        //         payload: {
        //             email: response.data.user.email,
        //             token: response.data.token
        //         }
        //     })
        //     toast.success('Has ingresado exitosamente!')
        //     router.push('/')
        // } else {
        //     toast.error('Ha ocurrido un error, intente mas tarde')
        // }
    }



    const updateUser = (user) => {
        dispatch({
            type: UPDATE_USER,
            payload: user
        })
    }

    const logOut = () => dispatch({ type: LOG_OUT });


    const updatePinsUser = (pin, type, dltPin) => {
        dispatch({
            type: UPDATE_PINS,
            payload: { pin, type, dltPin }
        })
    }



    return (
        <authContext.Provider
            value={{
                user: state.user,
                isLoggedIn: state.isLoggedIn,
                isLoading: state.isLoading,
                userRegister,
                logIn,
                logInGoogle,
                updateUser,
                logOut,
                updatePinsUser
            }}>
            {children}
        </authContext.Provider>
    )
}

export default AuthState