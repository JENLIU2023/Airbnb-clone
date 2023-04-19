const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage, User } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation')

//get all spots
router.get('/', async(req, res) => {
    let allSpots = await Spot.findAll();

    for(let ele of allSpots){
        //add avgRating
        const countOfReviews = await Review.count({
            where: {
                spotId: ele.id
            }
        });
        const sumOfStars = await Review.sum('stars', {
            where: {
                spotId: ele.id
            }
        })
        if(countOfReviews && sumOfStars){
            ele.dataValues.avgRating = sumOfStars/countOfReviews;
        }else {
            ele.dataValues.avgRating = null;
        }

        //add previewImage
        const preview = await SpotImage.findAll({
            attributes: ['url'],
            where: {
                spotId: ele.id
            }
        });
        
        if(preview.length > 0){
            ele.dataValues.previewImage = preview[0].url;
        }else{
            ele.dataValues.previewImage = null;
        }
    }

    res.json({
        Spots: allSpots
    });
})

//get all spots owned by current user
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;

    const spots = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    });

    for(let ele of spots){
        const countOfReviews = await Review.count({
            where: {
                spotId: ele.id
            }
        });
        const sumOfStars = await Review.sum('stars', {
            where: {
                spotId: ele.id
            }
        });       
        if(countOfReviews && sumOfStars){
            ele.dataValues.avgRating = sumOfStars/countOfReviews;
        }else{
            ele.dataValues.avgRating = null;
        }

        const preview = await SpotImage.findAll({
            attributes: ['url'],
            where: {
                spotId: ele.id
            }
        });
        if(preview.length > 0){
            ele.dataValues.previewImage = preview[0].url;
        }else{
            ele.dataValues.previewImage = null;
        }
    }

    res.json(spots);
})

//get details of a spot from an id
router.get('/:spotId', async (req, res) => {
    const {spotId} = req.params;

    const spot = await Spot.findByPk(spotId);

    if(!spot){
        return res.status(404).json(
            {
                message: "Spot couldn't be found"
            }
        )
    }

    const numReviews = await Review.count({
        where: {
            spotId: spotId
        }
    });
    const sumOfStars = await Review.sum('stars', {
        where: {
            spotId: spotId
        }
    })
    const images = await SpotImage.findAll({
        where: {
            spotId: spotId
        },
        attributes: ['id', 'url', 'preview']
    })
    const owner = await User.findByPk(spot.ownerId, {
        attributes: ['id', 'firstName', 'lastName']
    })

    if(numReviews) {
        spot.dataValues.numReviews = numReviews
    }else {
        spot.dataValues.numReviews = null
    };

    if(numReviews && sumOfStars) {
        spot.dataValues.avgStarRating = sumOfStars/numReviews
    }else{
        spot.dataValues.avgStarRating = null
    };

    if(images.length > 0) {
        spot.dataValues.SpotImages = images
    }else{
        spot.dataValues.SpotImages = 'No Images'
    };

    if(owner) {
        spot.dataValues.Owner = owner
    }else{
        spot.dataValues.Owner = 'No Information'
    }

    res.json(spot);
})

//create a spot
router.post('/', requireAuth, handleValidationErrors, async(req, res) => {
    const { address, city, state, country, 
            lat, lng, name, description, price } = req.body;
    const { user } = req;
    
    const newSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });
    
    res.status(201).json(newSpot);
})

//add an image to a spot based on the spot's id
// router.post('/:spotId/images', requireAuth, async(req, res) => {

// })



//edit a spot
router.put('/:spotId', requireAuth, handleValidationErrors, async(req, res) => {
    const { spotId } = req.params;
    const { address, city, state, country, 
        lat, lng, name, description, price } = req.body;
    const { user } = req;

    const spot = await Spot.findByPk(spotId)
    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    if(spot.ownerId === user.id){
        if(address) spot.address = address;
        if(city) spot.city = city;
        if(state) spot.state = state;
        if(country) spot.country = country;
        if(lat) spot.lat = lat;
        if(lng) spot.lng = lng;
        if(name) spot.name = name;
        if(description) spot.description = description;
        if(price) spot.price = price;

        await spot.save();
        return res.json(spot)
    }else{
        return res.json({"message": "No Proper Authorization"})
    }
})

//delete a spot
router.delete('/:spotId', requireAuth, async(req, res) => {
    const { spotId } = req.params;
    const { user } = req;

    const spot = await Spot.findByPk(spotId)
    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    if(spot.ownerId === user.id){
        await spot.destroy();
        return res.json({"message": "Successfully deleted"})
    }else{
        return res.json({"message": "No Proper Authorization"})
    }
})


module.exports = router;