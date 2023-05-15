import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchSpots } from '../../store/spots';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import DeleteSpotModal from '../DeleteSpotModal';
import "./GetCurrentSpots.css";

function GetCurrentSpots () {
    const history = useHistory();

    const sessionUser = useSelector(state => state.session.user);
    
    if(!sessionUser) {
        history.push('/')
    }

    const userId = sessionUser?.id;
    
    const dispatch = useDispatch();

    const allSpots = Object.values(useSelector(state => state.spots.allSpots));

    const spots = [];
    for(let spot of allSpots){
        if(spot.ownerId === userId) spots.push(spot)
    }

    for(let spot of spots){
        if(spot.avgRating !== "New"){
            spot.avgRating = Number.parseFloat(spot.avgRating).toFixed(1)
        }
    }

    useEffect(()=>{
        dispatch(fetchSpots())
    }, [dispatch])

    const handleClick = (e) => {
        history.push('/spots/new')
    }

    return (
        <div className='currentSpots'>
            <div className='currentSpots1'>
                <h1>Manage Your Spots</h1>
                <button onClick={handleClick}>Create a New Spot</button>
            </div>
            <div className='currentSpots2'>
                {spots?.map(spot=>(
                    <div className="currentSpotDetail">
                        <section  onClick={()=>history.push(`/spots/${spot.id}`)}>
                            <img src={spot?.previewImage} alt="img"></img>
                            <div className='currentSpotsDetail1'>
                                <h4>{spot?.city}, {spot?.state}</h4>
                                <div>
                                    <i className="fa-solid fa-star fa-sm"></i>
                                    <h3>{spot.avgRating}</h3>
                                </div>
                            </div>
                            <h3 className='currentSpotPrice'>${spot?.price} night</h3>
                        </section>    
                        <div className='currentSpotButton'>
                            <button onClick={(e)=>history.push(`/spots/${spot.id}/edit`)}>Update</button>
                            <button className='modalButton'>
                                <OpenModalMenuItem
                                itemText="Delete"
                                // onItemClick={}
                                modalComponent={<DeleteSpotModal spot={spot}/>}
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GetCurrentSpots;