const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

//get all spots && Add Query Filters to Get All Spots
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

    res.json({
        Spots: spots
    });
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
router.post('/:spotId/images', requireAuth, async(req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const { user } = req;

    const spot = await Spot.findByPk(spotId)
    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    if(spot.ownerId === user.id){
        const newSpotImage = await SpotImage.create({
            spotId,
            url,
            preview
        });

        const result = await SpotImage.findByPk(newSpotImage.id, {
            attributes: ['id', 'url', 'preview']
        })
        res.json(result);        
    }else{
        res.status(403).json({
            message: "Forbidden"
        })
    }

})

//

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
        // if(address) spot.address = address;
        // if(city) spot.city = city;
        // if(state) spot.state = state;
        // if(country) spot.country = country;
        // if(lat) spot.lat = lat;
        // if(lng) spot.lng = lng;
        // if(name) spot.name = name;
        // if(description) spot.description = description;
        // if(price) spot.price = price;

        spot.address = address;
        spot.city = city;
        spot.state = state;
        spot.country = country;
        spot.lat = lat;
        spot.lng = lng;
        spot.name = name;
        spot.description = description;
        spot.price = price;

        await spot.save();
        return res.json(spot)
    }else{
        res.status(403).json({
            message: "Forbidden"
        })
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
        return res.json({message: "Successfully deleted"})
    }else{
        res.status(403).json({
            message: "Forbidden"
        })
    }
})

//get all reviews by a Spot's id
router.get('/:spotId/reviews', async(req, res) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);
    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    const reviews = await Review.findAll({
        where: {
            spotId: spotId
        }
    });

    for(let review of reviews){
        const user = await User.findByPk(review.userId, {
            attributes: ['id', 'firstName', 'lastName']
        })
        const reviewImage = await ReviewImage.findAll({
            where: {
                reviewId: review.id
            },
            attributes: ['id', 'url']
        })

        review.dataValues.User = user;
        review.dataValues.ReviewImages = reviewImage;
    }

    res.json({
        Reviews: reviews
    })
})

//create a review for a spot based on the spot's id
router.post('/:spotId/reviews', requireAuth, handleValidationErrors, async(req, res) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const { user } = req;

    const spot = await Spot.findByPk(spotId);
    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    
    const reviewsPosted = await Review.findAll({
        where: {
            userId: user.id
        }
    })
    for(let ele of reviewsPosted){
        if(ele.spotId == spotId){
            return res.status(500).json({
                message: "User already has a review for this spot"
            })
        }
    }

    const newReview = await Review.create({
        spotId,
        userId: user.id,
        review,
        stars
    })

    res.status(201).json(newReview)
})

//get all bookings for a spot based on the spot's id
router.get('/:spotId/bookings', requireAuth, async(req, res) => {
    const { spotId } = req.params;
    const { user } = req;

    const spot = await Spot.findByPk(spotId);
    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    if(user.id !== spot.ownerId){
        const result1 = await Booking.findAll({
            where: {
                spotId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        });
        for(let res of result1){
            res.dataValues.startDate = res.dataValues.startDate.toISOString().split('T')[0];
            res.dataValues.endDate = res.dataValues.endDate.toISOString().split('T')[0];
        }

        return res.json({
            Bookings: result1
        })
    }

    if(user.id === spot.ownerId){
        const result2 = await Booking.findAll({
            where: {
                spotId
            }
        });
        for(let res of result2){
            res.dataValues.startDate = res.dataValues.startDate.toISOString().split('T')[0];
            res.dataValues.endDate = res.dataValues.endDate.toISOString().split('T')[0];

            const user = await User.findByPk(res.userId, {
                attributes: ['id', 'firstName', 'lastName']
            });
            res.dataValues.User = user;
        }
        return res.json({
            Bookings: result2
        })
    }
})

//create a booking from a spot based on the spot's id
router.post('/:spotId/bookings', requireAuth, handleValidationErrors, async(req, res, next) => {
    const { spotId } = req.params;
    const { user } = req;
    const { startDate, endDate } = req.body;

    const spot = await Spot.findByPk(spotId);
    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    if(user.id !== spot.ownerId){
        if(new Date(startDate).getTime() >= new Date(endDate).getTime()){
            const err = new Error();
            err.status = 400;
            err.message = "Bad Request";
            err.errors = {endDate: "endDate cannot be on or before startDate"};

            return next(err)
        }
        const bookings = await Booking.findAll({
            where: {
                spotId: spot.id
            }
        })
        for(let booking of bookings){
            const d1 = new Date(booking.startDate.toISOString().split('T')[0]).getTime();
            const d2 = new Date(startDate).getTime();
            const d3 = new Date(booking.endDate.toISOString().split('T')[0]).getTime();
            const d4 = new Date(endDate).getTime();

            if(d2 >= d1 && d2 <= d3){
                const err = new Error();
                err.status = 403;
                err.message = "Sorry, this spot is already booked for the specified dates";
                err.errors = {startDate: "Start date conflicts with an existing booking"};
                return next(err)
            }

            if(d4 >= d1 && d4 <= d3){
                const err = new Error();
                err.status = 403;
                err.message = "Sorry, this spot is already booked for the specified dates";
                err.errors = {endDate: "End date conflicts with an existing booking"};
                return next(err)
            }
        }

        const newBooking = await Booking.create({
            userId: user.id,
            spotId: spot.id,
            startDate,
            endDate
        })
        newBooking.dataValues.startDate = newBooking.dataValues.startDate.toISOString().split('T')[0];
        newBooking.dataValues.endDate = newBooking.dataValues.endDate.toISOString().split('T')[0];

        res.json(newBooking)
    }else{
        res.status(403).json({
            message: "Forbidden"
        })
    }
})

module.exports = router;