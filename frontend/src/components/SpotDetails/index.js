import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSingleSpot } from '../../store/spots';
import { fetchReviews } from '../../store/reviews';
import './SpotDetails.css';

function GetSpotDetails() {
    const { spotId } = useParams();

    const spot = useSelector(state=>state.spots.singleSpots[spotId])

    const reviews = Object.values(useSelector(state=>state.reviews.spot))

    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(fetchSingleSpot(spotId))
    }, [dispatch, spotId])

    useEffect(()=>{
        dispatch(fetchReviews(spotId))
    }, [dispatch, spotId])

    if(!spot) return (<></>);
    let urls = [];
    if(spot.SpotImages){
        for(let i=0; i<5; i++){
            if(spot.SpotImages[i]){
                urls.push(spot.SpotImages[i].url)
            }else{
                urls.push('https://a0.muscache.com/im/pictures/ea555b8d-bb92-4528-9a0c-1659fc6358e7.jpg')
            }
        }
    }
    
    return (
        <div className='spotDetails'>
            <div className='spotDetails1'>
                <h2>{spot.name}</h2>
                <h4>{spot.city} {spot.state}</h4>
                <div className='spotImages'>
                    {urls?.map(url=>(
                        <img src={url} alt="image"></img>
                    ))}
                </div>
            </div>
            <div className='spotDetails2'>
                <div className='spotDetails2Owner'>
                    <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                    <p>{spot.description}</p>
                </div>
                <div className='spotDetails2Review'>
                    <div>
                        <h2>${spot.price}night</h2>
                        <i className="fa-solid fa-star fa-sm"></i>
                        <h2>{spot.avgStarRating}</h2>
                        <h2>{spot.numReviews} reviews</h2>
                    </div>
                    <button>Reserve</button>
                </div>
            </div>
            <div className='spotDetails3'>
                <i className="fa-solid fa-star fa-sm"></i>
                <h2>{spot.avgStarRating}</h2>
                <h2>{spot.numReviews? spot.numReviews:0} reviews</h2>
            </div>
            <div>
                {reviews.map(review=>(
                    <div>
                        <h3>{review?.User.firstName}</h3>
                        <h4>{review?.createdAt.slice(0, 10)}</h4>
                        <p>{review?.review}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GetSpotDetails;