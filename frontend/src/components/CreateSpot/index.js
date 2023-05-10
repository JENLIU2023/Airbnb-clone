import SpotForm from "../SpotForm";


const CreateSpot = () => {
    const spot = {
        country: "",
        address: "",
        city: "",
        state: "",
        lat: "",
        lng: "",
        description: "",
        name: "",
        price: "",
        // url1: "",
        // url2: "",
        // url3: "",
        // url4: "",
        // url5: "",
    }

    return (
        <SpotForm spot={spot} formType="Create a new Spot"/>
    )
}

export default CreateSpot;