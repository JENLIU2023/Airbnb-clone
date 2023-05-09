import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';

/**  Action Creators: */
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

export const loadSingleSpot = (spot) => ({
    type: LOAD_SINGLE_SPOT,
    spot
})

/** Thunk Action Creators: */
export const fetchSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')

    if(res.ok) {
        const spots = await res.json();
        dispatch(loadSpots(spots));
        return spots;
    }
}

export const fetchSingleSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)

    if(res.ok) {
        const spot = await res.json();
        dispatch(loadSingleSpot(spot));
    }else {
        const errors = await res.json();
        return errors;
    }
}


// state object
const initialState = {
    allSpots: {},
    singleSpots: {}
};


/** Reducer: */
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const newAllSpots = {};
            action.spots.Spots.forEach((spot) => {
                newAllSpots[spot.id] = spot;
            });
            return {...state, allSpots: {...newAllSpots}};
        }
        case LOAD_SINGLE_SPOT: {
            return {...state, singleSpots: {[action.spot.id]: action.spot}}
        }
        default:
            return state;
    }
        
}

export default spotsReducer;