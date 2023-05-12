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
        SpotImages: []
    }

    return (
        <SpotForm spot={spot} formType="Create a new Spot"/>
    )
}

export default CreateSpot;