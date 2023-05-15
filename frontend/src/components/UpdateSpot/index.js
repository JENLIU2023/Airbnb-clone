import SpotForm from "../SpotForm";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { fetchSingleSpot } from "../../store/spots";

const UpdateSpot = () => {
    const { spotId } = useParams();
    const spot = useSelector(state=>state.spots.singleSpots[spotId])

    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(fetchSingleSpot(spotId))
    }, [dispatch, spotId])

    if(!spot) return (<></>);

    return (
        <SpotForm spot={spot} formType="Update your Spot"/>
    )
}

export default UpdateSpot;