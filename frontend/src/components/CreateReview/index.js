import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory, useParams } from 'react-router-dom';
import { createReview } from "../../store/reviews";
import "./CreateReview.css";

function CreateReview ({spot, sessionUser}){
    const history = useHistory();
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [errors, setErrors] = useState({});


    const isDisabled = () => {
        if((review?.length >= 10) && rating >=1) return false;
        else return true;
    }
    
    const handleReviewSubmit = (e) => {
        // e.preventDefault();
        setErrors({})
        const newReview = {
            spotId: spot.id,
            userId: sessionUser.id,
            review,
            stars: rating
        }
        return dispatch(createReview(newReview))
            .then(()=>history.push(`/spots/${spot.id}`))
            .then(closeModal())
            .catch(async (res) => {
                const errBackend = await res.json();
            })
    }

    return (
        <div>
            <h1>How was your stay?</h1>
            <label>
                <input 
                    type='text'
                    placeholder='Leave your review here...'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}/>
            </label>
            <div className="startRating">
                {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                        <button type="button" key={index} 
                            className={(index <= (hover || rating) ? "on" : "off") + " starButton"}
                            onClick={()=>setRating(index)}
                            onMouseEnter={()=>setHover(index)}
                            onMouseLeave={()=>setHover(rating)}
                            >
                            <span className="star">&#9733;</span>
                        </button>
                    )
                })}
            </div>
            <button disabled={isDisabled()} onClick={handleReviewSubmit}>Submit Your Review</button>
        </div>
    )
}

export default CreateReview;