import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_REVIEWS = 'spots/LOAD_REVIEWS';

/**  Action Creators: */
export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
})

/** Thunk Action Creators: */
export const fetchReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    
    if(res.ok) {
        const reviews = await res.json();
        // console.log("reviews:", reviews)
        dispatch(loadReviews(reviews));
    }else {
        const errors = await res.json();
        return errors;
    }
}

// state object
const initialState = {
    spot: {},
    user: {}
};

/** Reducer: */
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            const newSpotState = {};
            action.reviews.Reviews.forEach((review) => {
                newSpotState[review.id] = review;
            });
            return {...state, spot: {...newSpotState}}
        }
        default:
            return state;
    }
}

export default reviewsReducer;