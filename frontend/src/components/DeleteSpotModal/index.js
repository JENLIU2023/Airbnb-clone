import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpot } from "../../store/spots";

function DeleteSpotModal({spot}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDeleteButton = (e) => {
        return dispatch(deleteSpot(spot))
            .then(closeModal)
    }

    const handleNoDeleteButton = (e) => {
        return closeModal();
    }
    return (
        <div>
            <h1>Confirm Delete</h1>
            <h3>Are you sure you want to remove this spot from the listings?</h3>
            <button onClick={handleDeleteButton}>Yes (Delete Spot)</button>
            <button onClick={handleNoDeleteButton}>No (Keep Spot)</button>
        </div>
    )
}

export default DeleteSpotModal;