import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpot } from "../../store/spots";
import "./DeleteSpotModal.css"

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
        <div className="deleteSpotModal">
            <h2>Confirm Delete</h2>
            <h3>Are you sure you want to remove this spot?</h3>
            <button onClick={handleDeleteButton} id="deleteSpot">Yes (Delete Spot)</button>
            <button onClick={handleNoDeleteButton} id="keepSpot">No (Keep Spot)</button>
        </div>
    )
}

export default DeleteSpotModal;