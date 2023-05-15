import { csrfFetch } from "./csrf";
import { fetchSingleSpot } from "./spots";

/** Action Type Constants: */
export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
export const ADD_REVIEW = 'reviews/ADD_REVIEW';
export const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW';

/**  Action Creators: */
export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
})
export const addReview = (reviewCreated) => ({
    type: ADD_REVIEW,
    reviewCreated
})
export const removeReview = (review) => ({
    type: REMOVE_REVIEW,
    review
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

export const createReview = (newReview, sessionUser) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${newReview.spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
    })

    if(res.ok){
        const review = await res.json();
        const reviewCreated = {...review, "User": sessionUser}
        
        dispatch(addReview(reviewCreated));
        dispatch(fetchSingleSpot(reviewCreated.spotId))
        return reviewCreated;
    }

    return res;
}

export const deleteReview = (review) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${review.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    })

    if(res.ok){
        dispatch(removeReview(review))
        dispatch(fetchSingleSpot(review.spotId))
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
        case ADD_REVIEW: {
            return {...state, spot:{...state.spot, [action.reviewCreated.id]: action.reviewCreated}};
        }
        case REMOVE_REVIEW: {
            const newState = {...state, spot: {...state.spot}};
            delete newState.spot[action.review.id];
            return newState;
        }
        default:
            return state;
    }
}

export default reviewsReducer;