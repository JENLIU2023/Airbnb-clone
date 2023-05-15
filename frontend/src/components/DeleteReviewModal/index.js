import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/reviews";
import "./DeleteReviewModal.css"

function DeleteReviewModal({review}){
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDeleteButton = (e) => {
        return dispatch(deleteReview(review))
            .then(closeModal)
    }

    const handleNoDeleteButton = (e) => {
        return closeModal();
    }

    return (
        <div className="deleteReviewModal">
            <h2>Confirm Delete</h2>
            <h3>Are you sure you want to delete this review?</h3>
            <button onClick={handleDeleteButton}>Yes (Delete Review)</button>
            <button onClick={handleNoDeleteButton} id="keepReview">No (Keep Review)</button>
        </div>
    )
}

export default DeleteReviewModal;