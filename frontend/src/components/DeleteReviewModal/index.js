import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/reviews";

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
        <div>
            <h1>Confirm Delete</h1>
            <h3>Are you sure you want to delete this review?</h3>
            <button onClick={handleDeleteButton}>Yes (Delete Review)</button>
            <button onClick={handleNoDeleteButton}>No (Keep Review)</button>
        </div>
    )
}

export default DeleteReviewModal;