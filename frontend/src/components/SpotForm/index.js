import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSpot } from '../../store/spots';
import "./SpotForm.css"

const SpotForm = ({ spot, formType }) => {
    const history = useHistory();
    const [country, setCountry] = useState(spot?.country);
    const [address, setAddress] = useState(spot?.address);
    const [city, setCity] = useState(spot?.city);
    const [state, setState] = useState(spot?.state);
    const [lat, setLat] = useState(spot?.lat);
    const [lng, setLng] = useState(spot?.lng);
    const [description, setDescription] = useState(spot?.description);
    const [name, setName] = useState(spot?.name);
    const [price, setPrice] = useState(spot?.price);
    // const [url1, setUrl1] = useState(spot?.url);
    // const [url2, setUrl2] = useState(spot?.url);
    // const [url3, setUrl3] = useState(spot?.url);
    // const [url4, setUrl4] = useState(spot?.url);
    // const [url5, setUrl5] = useState(spot?.url);

    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();

    const handleSumbit = async (e) => {
        e.preventDefault();
        setErrors({})
        spot = {...spot, country, address, city, state, lat, lng, description, name, price}
        
        if(formType === 'Create a new Spot'){
            const newSpot = await dispatch(createSpot(spot));
            console.log("what is spot", newSpot)
            spot = newSpot;
        }else if (formType === 'Update Spot'){

        }

        if(spot.errors){
            setErrors(spot.errors)
        }else{
            history.push(`/spots/${spot.id}`)
        }
    }

    return (
        <form onSubmit={handleSumbit} className='spotForm'>
            <div className='formPart1'>
                <h2>{formType}</h2>
                <h3>Where's your place located?</h3>
                <h4>Guests will only get your exact address once they booked a reservation</h4>
                <div>
                    <h4>Country</h4>
                    <h4 className='errors'>{errors.country}</h4>
                </div>
                
                <label>Country
                    <input 
                        type='text'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}/>
                </label>
                <label>Street Address
                    <input 
                        type='text'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}/>
                </label>
                <label>City
                    <input 
                        type='text'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}/>
                </label>
                <label>State
                    <input 
                        type='text'
                        value={state}
                        onChange={(e) => setState(e.target.value)}/>
                </label>
                <label>Latitude
                    <input 
                        type='number'
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}/>
                </label>
                <label>Longitude
                    <input 
                        type='number'
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}/>
                </label>
            </div>
            <div className='formPart2'>
                <h3>Describe your place to guests</h3>
                <h4>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</h4>
                <label>
                    <input 
                        type='text'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}/>
                </label>
            </div>
            <div className='formPart3'>
                <h3>Create a title for your spot</h3>
                <h4>Catch guests' attention with a spot title that highlights what makes your place special.</h4>
                <label>
                    <input 
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>
                </label>
            </div>
            <div className='formPart4'>
                <h3>Set a base price for your spot</h3>
                <h4>Competitive pricing can help your listing stand out and rank higher in search results.</h4>
                <label>$
                    <input 
                        type='number'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}/>
                </label>
            </div>
            <div className='formPart5'>
                <h3>Liven up your spot with photos</h3>
                <h4>Submit a link a least one photo to publish your spot.</h4>
                {/* <label>
                    <input 
                        type='url'
                        value={url1}
                        onChange={(e) => setUrl1(e.target.value)}/>
                </label>
                <label>
                    <input 
                        type='url'
                        value={url2}
                        onChange={(e) => setUrl2(e.target.value)}/>
                </label>
                <label>
                    <input 
                        type='url'
                        value={url3}
                        onChange={(e) => setUrl3(e.target.value)}/>
                </label>
                <label>
                    <input 
                        type='url'
                        value={url4}
                        onChange={(e) => setUrl4(e.target.value)}/>
                </label>
                <label>
                    <input 
                        type='url'
                        value={url5}
                        onChange={(e) => setUrl5(e.target.value)}/>
                </label> */}
            </div>
            <div className='formPart6'>
                <button type="submit">Create Spot</button>
            </div>
        </form>
    )
}

export default SpotForm;