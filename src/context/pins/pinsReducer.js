import { UPDATE_PINS, GET_PINS, SET_CURRENT, SET_EDIT } from "../../utils/types";

const reducer = (state, action) => {
    switch (action.type) {

        case GET_PINS:
            let pins = action.payload.sort((a, b) => b.likes[0] - a.likes[0]);
            const top = pins.slice(0, 5)

            return {
                ...state,
                pins: {
                    allPins: pins,
                    topPins: top
                }
            }

        case UPDATE_PINS:

            let newAll = state.pins.allPins;
            if (action.payload.filter) {
                newAll = newAll.filter(pin => pin._id !== action.payload.pin._id);
            }

            if (action.payload.add) {
                newAll = [...newAll, action.payload.pin]
            }
            newAll = newAll.sort((a, b) => b.likes[0] - a.likes[0])

            let updatedTop = newAll.slice(0, 5);

            return {
                ...state,
                pins: {
                    allPins: newAll,
                    topPins: updatedTop
                }

            }

        case SET_CURRENT:
            return {
                ...state,
                currentPlaceId: action.payload
            }

        case SET_EDIT:
            return {
                ...state,
                editPin: action.payload
            }

        default:
            return { ...state };
    }
}

export default reducer;