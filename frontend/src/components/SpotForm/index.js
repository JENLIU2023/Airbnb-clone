import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSpot, updateSpot } from '../../store/spots';
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

    const [url1, setUrl1] = useState("");
    const [url2, setUrl2] = useState("");
    const [url3, setUrl3] = useState("");
    const [url4, setUrl4] = useState("");
    const [url5, setUrl5] = useState("");
    const urls = [url1, url2, url3, url4, url5];

    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    
    let fetchMethod;
    let formPart5;
    if(formType === 'Create a New Spot'){
        fetchMethod = createSpot;
        formPart5 = "formPart5"
    }else if(formType === 'Update your Spot'){
        fetchMethod = updateSpot;
        formPart5 = "formPart5" + " hidden";
    }

    const handleSumbit = async (e) => {
        e.preventDefault();
        setErrors({})
        spot = {...spot, 
                country, 
                address, 
                city, 
                state, 
                lat, 
                lng, 
                description, 
                name, 
                price, 
                SpotImages: [
                    {"url": url1, "preview": true},
                    {"url": url2, "preview": false},
                    {"url": url3, "preview": false},
                    {"url": url4, "preview": false},
                    {"url": url5, "preview": false}
                ]}

        return dispatch(fetchMethod(spot))
            .then(newSpot=>history.push(`/spots/${newSpot.id}`))
            .catch(async (res) => {
                const errBackend = await res.json();
                if(errBackend.errors.lat){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["lat"] = errBackend.errors.lat;
                        return newErrors;
                    }) 
                }
                if(errBackend.errors.lng){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["lng"] = errBackend.errors.lng;
                        return newErrors;
                    })
                    
                }
                if(errBackend.errors.name){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["name"] = errBackend.errors.name;
                        return newErrors;
                    })
                }
                //handle errors from form submisstion
                if(country.length === 0){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["country"] = "Country is required";
                        return newErrors;
                    })
                }
                if(address.length === 0){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["address"] = "Address is required";
                        return newErrors;
                    })
                }
                if(city.length === 0){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["city"] = "City is required";
                        return newErrors;
                    })
                }
                if(state.length === 0){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["state"] = "State is required";
                        return newErrors;
                    })
                }
                if(lat.length === 0){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["lat"] = "Latitude is required";
                        return newErrors;
                    })
                }
                if(lng.length === 0){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["lng"] = "Longitude is required";
                        return newErrors;
                    })
                }
                if(description.length < 30){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["description"] = "Description needs a minimum of 30 characters";
                        return newErrors;
                    })
                }
                if(name.length === 0){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["name"] = "Name is required";
                        return newErrors;
                    })
                }
                if(price.length === 0){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["price"] = "Price is required";
                        return newErrors;
                    })
                }
                if(url1.length === 0){
                    setErrors(prevErrors=>{
                        const newErrors = {...prevErrors};
                        newErrors["url1"] = "Preview image is required";
                        return newErrors;
                    })
                }
                
                for(let i=0; i<5; i++){
                    if(urls[i] && (!urls[i].endsWith('.png') || !urls[i].endsWith(".jpg") || !urls[i].endsWith(".jpeg"))){
                        setErrors(prevErrors=>{
                            const string = "url" + (i+1);
                            const newErrors = {...prevErrors};
                            newErrors[string] = "Image URL must end in .png .jpg or .jpeg";
                            return newErrors;
                        })
                    }
                }
            })
    }

    return (
        <form onSubmit={handleSumbit} className='spotForm'>
            <div className='formPart1'>
                <h2>{formType}</h2>
                <h3>Where's your place located?</h3>
                <h4>Guests will only get your exact address once they booked a reservation</h4>
                
                <div>
                    <h4>Country</h4>
                    <h4 className='formErrors'>{errors?.country}</h4>
                </div>
                <label>
                    <input 
                        type='text'
                        placeholder='Country'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}/>
                </label>
                <div>
                    <h4>Street Address</h4>
                    <h4 className='formErrors'>{errors?.address}</h4>
                </div>
                <label>
                    <input 
                        type='text'
                        placeholder='Address'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}/>
                </label>

                <section className='section1'>
                    <section>
                        <div>
                            <h4>City</h4>
                            <h4 className='formErrors'>{errors?.city}</h4>
                        </div>
                        <label>
                            <input 
                                type='text'
                                placeholder='City'
                                value={city}
                                onChange={(e) => setCity(e.target.value)}/>
                        </label>
                    </section>

                    <section>
                        <div>
                            <h4>State</h4>
                            <h4 className='formErrors'>{errors?.state}</h4>
                        </div>
                        <label>
                            <input 
                                type='text'
                                placeholder='State'
                                value={state}
                                onChange={(e) => setState(e.target.value)}/>
                        </label>
                    </section>
                </section>

                <section className='section2'>
                    <section>
                        <div>
                            <h4>Latitude</h4>
                            <h4 className='formErrors'>{errors?.lat}</h4>
                        </div>
                        <label>
                            <input 
                                type='number'
                                placeholder='Latitude'
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}/>
                        </label>
                    </section>    

                    <section>
                        <div>
                            <h4>Longitude</h4>
                            <h4 className='formErrors'>{errors?.lng}</h4>
                        </div>
                        <label>
                            <input 
                                type='number'
                                placeholder='Longitude'
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}/>
                        </label>
                    </section>
                </section>
            </div>

            <div className='formPart2'>
                <h3>Describe your place to guests</h3>
                <h4>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</h4>
                <label>
                    <textarea 
                        type='text'
                        placeholder='Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}/>
                </label>
                <h4 className='formErrors'>{errors?.description}</h4>
            </div>

            <div className='formPart3'>
                <h3>Create a title for your spot</h3>
                <h4>Catch guests' attention with a spot title that highlights what makes your place special.</h4>
                <label>
                    <input 
                        type='text'
                        placeholder='Name of your spot'
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>
                </label>
                <h4 className='formErrors'>{errors?.name}</h4>
            </div>

            <div className='formPart4'>
                <h3>Set a base price for your spot</h3>
                <h4>Competitive pricing can help your listing stand out and rank higher in search results.</h4>
                <label>$
                    <input 
                        type='number'
                        placeholder='Price per night (USD)'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}/>
                </label>
                <h4 className='formErrors'>{errors?.price}</h4>
            </div>

            <div className={formPart5}>
                <h3>Liven up your spot with photos</h3>
                <h4>Submit a link a least one photo to publish your spot.</h4>
                <label>
                    <input 
                        type='url'
                        placeholder='Preview Image URL'
                        value={url1}
                        onChange={(e) => setUrl1(e.target.value)}/>
                </label>
                <h4 className='formErrors'>{errors?.url1}</h4>
                <label>
                    <input 
                        type='url'
                        placeholder='Image URL'
                        value={url2}
                        onChange={(e) => setUrl2(e.target.value)}/>
                </label>
                <h4 className='formErrors'>{errors?.url2}</h4>
                <label>
                    <input 
                        type='url'
                        placeholder='Image URL'
                        value={url3}
                        onChange={(e) => setUrl3(e.target.value)}/>
                </label>
                <h4 className='formErrors'>{errors?.url3}</h4>
                <label>
                    <input 
                        type='url'
                        placeholder='Image URL'
                        value={url4}
                        onChange={(e) => setUrl4(e.target.value)}/>
                </label>
                <h4 className='formErrors'>{errors?.url4}</h4>
                <label>
                    <input 
                        type='url'
                        placeholder='Image URL'
                        value={url5}
                        onChange={(e) => setUrl5(e.target.value)}/>
                </label>
                <h4 className='formErrors'>{errors?.url5}</h4>
            </div>

            <div className='formPart6'>
                <button type="submit">{formType==='Create a New Spot'? "Create Spot":"Update your spot"}</button>
            </div>
        </form>
    )
}

export default SpotForm;