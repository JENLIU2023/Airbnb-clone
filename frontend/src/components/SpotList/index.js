import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchSpots } from '../../store/spots';
import './SpotList.css'

function GetSpotList() {
    const history = useHistory();
    const dispatch = useDispatch();

    const spots = Object.values(useSelector(state => state.spots.allSpots));

    useEffect(()=>{
        dispatch(fetchSpots())
    }, [dispatch])

    return (
        <ul className='spotList'>
            {spots.map(spot=>(
                <li key={spot.id} onClick={()=>history.push(`/spots/${spot.id}`)}>
                    <img src={spot.previewImage} alt='view'></img>
                    <div className='spotInfo'>
                        <div>{spot.city}, {spot.state}</div>
                        <i className="fa-solid fa-star fa-sm"></i>
                        <div>{spot.avgRating}</div>
                        <div>${spot.price}night</div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default GetSpotList;