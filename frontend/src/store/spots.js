import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';
export const ADD_SPOT = 'spots/ADD_SPOT';
export const REMOVE_SPOT = 'spots/REMOVE_SPOT';
export const EDIT_SPOT = 'spots/EDIT_SPOT';

/**  Action Creators: */
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

export const loadSingleSpot = (spot) => ({
    type: LOAD_SINGLE_SPOT,
    spot
})

export const addSpot = (newSpot) => ({
    type: ADD_SPOT,
    newSpot
})

export const removeSpot = (spot) => ({
    type: REMOVE_SPOT,
    spot
})

export const editSpot = (newSpot) => ({
    type: EDIT_SPOT,
    newSpot
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

export const createSpot = (spot) => async (dispatch) => {

    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot)
    })

    if(res.ok){
        const newSpot = await res.json();
        dispatch(addSpot(newSpot));
        if(spot.SpotImages){
            for(let img of spot.SpotImages){
                if(img.url){
                    await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(img)
                    })
                }
            }
        }
        return newSpot;    
    }

    return res;
}

export const deleteSpot = (spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot)
    })

    if(res.ok){
        dispatch(removeSpot(spot))
    }
}

export const updateSpot = (spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot)
    })

    if(res.ok){
        const newSpot = await res.json();
        dispatch(editSpot(newSpot));
        return newSpot;
    }

    return res;
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
        case ADD_SPOT: {
            return {...state, allSpots: {...state.allSpots, [action.newSpot.id]: action.newSpot}, singleSpots: {[action.newSpot.id]: action.newSpot}}
        }
        case EDIT_SPOT: {
            return {...state, singleSpots: {[action.newSpot.id]: action.newSpot}}
        }
        case REMOVE_SPOT: {
            const newState = {...state, allSpots: {...state.allSpots}};
            delete newState.allSpots[action.spot.id];
            return newState;
        }
        default:
            return state;
    }
        
}

export default spotsReducer;