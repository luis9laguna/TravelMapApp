import { useEffect, useReducer } from "react";
import pinsContext from "./pinsContext";
import pinsReducer from "./pinsReducer";
import { toast } from 'react-toastify'
import clientAxios from '../../config/axios'

import { GET_PINS, UPDATE_PINS, SET_CURRENT, SET_EDIT } from "../../utils/types";

const PinsState = ({ children }) => {


    //ROUTER
    const initialState = {
        pins: {
            allPins: [],
            topPins: [],
        },
        currentPlaceId: null,
        editPin: null
    }

    const [state, dispatch] = useReducer(pinsReducer, initialState);

    const getPins = async () => {
        try {
            const response = await clientAxios.get("/pin/all");

            if (response.data.ok) {
                dispatch({
                    type: GET_PINS,
                    payload: response.data.pins
                })
            } else {
                toast.error('An error occured, please try later')
            }
        } catch (err) {
            toast.error('An error occured, please try later')
        }
    };


    useEffect(() => getPins(), []);

    const updateAllPins = (pin, add = false, filter = false) => {
        dispatch({
            type: UPDATE_PINS,
            payload: {
                pin,
                add,
                filter
            }
        })
    }

    const setCurrentPlaceId = (id) => {
        dispatch({
            type: SET_CURRENT,
            payload: id
        })
    }


    const setEditPin = (pin) => {
        dispatch({
            type: SET_EDIT,
            payload: pin
        })
    }


    return (
        <pinsContext.Provider
            value={{
                pins: state.pins,
                currentPlaceId: state.currentPlaceId,
                editPin: state.editPin,
                updateAllPins,
                setCurrentPlaceId,
                setEditPin
            }}>
            {children}
        </pinsContext.Provider>
    )
}

export default PinsState