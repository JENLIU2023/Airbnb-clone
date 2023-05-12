const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

//get all spots && Add Query Filters to Get All Spots
router.get('/', async(req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
    let where = {};
    let pagination = {};    
    
    //QUERY FILTERS
    //pagination
    if(!page) page = 1;
    if(!size) size = 20;

    page = parseInt(page);    
    size = parseInt(size);

    if(isNaN(page)){
        const err = new Error();
        err.status = 400;
        err.message = "Bad Request";
        err.errors = {page: "Page must be an integer"};
        return next(err)
    }else if(page < 1){
        const err = new Error();
        err.status = 400;
        err.message = "Bad Request";
        err.errors = {page: "Page must be be greater than or equal to 1"};
        return next(err)
    }else if(page > 10){
        const err = new Error();
        err.status = 400;
        err.message = "Bad Request";
        err.errors = {page: "Page must be be less than or equal to 10"};
        return next(err)
    }

    if(isNaN(size)){
        const err = new Error();
        err.status = 400;
        err.message = "Bad Request";
        err.errors = {page: "Size must be an integer"};
        return next(err)
    }else if(size < 1){
        const err = new Error();
        err.status = 400;
        err.message = "Bad Request";
        err.errors = {page: "Size must be be greater than or equal to 1"};
        return next(err)
    }else if(size > 20){
        const err = new Error();
        err.status = 400;
        err.message = "Bad Request";
        err.errors = {page: "Size must be be less than or equal to 20"};
        return next(err)
    }

    pagination.limit = size;
    pagination.offset = size * (page - 1);

    //Lat
    let checkMinLat;
    let checkMaxLat;

    if(minLat){
        minLat = parseFloat(minLat);
        if(isNaN(minLat) || minLat < -90 || minLat > 90) {
            const err = new Error();
            err.status = 400;
            err.message = "Bad Request";
            err.errors = {page: "Minimum latitude is invalid"};
            return next(err)
        }
        checkMinLat = true;
    }
    if(maxLat){
        maxLat = parseFloat(maxLat);        
        if(isNaN(maxLat) || maxLat < -90 || maxLat > 90) {
            const err = new Error();
            err.status = 400;
            err.message = "Bad Request";
            err.errors = {page: "Maximum latitude is invalid"};
            return next(err)
        }        
        checkMaxLat = true;
    }
    if(checkMinLat && checkMaxLat){
        if(minLat > maxLat){
            const err = new Error();
            err.status = 400;
            err.message = "Bad Request";
            err.errors = {page: "Maximum latitude must be greater or equal to minimum latitude"};
            return next(err)
        }        
        where.lat = { [Op.between]: [minLat, maxLat] };
    }
    if(checkMinLat && !checkMaxLat){
        where.lat = { [Op.gte]: minLat };
    }
    if(!checkMinLat && checkMaxLat){
        where.lat = { [Op.lte]: maxLat}
    }

    //Lng
    let checkMinLng;
    let checkMaxLng;

    if(minLng){
        minLng = parseFloat(minLng);
        if(isNaN(minLng) || minLng < -180 || minLng > 180) {
            const err = new Error();
            err.status = 400;
            err.message = "Bad Request";
            err.errors = {page: "Minimum longitude is invalid"};
            return next(err)
        }
        checkMinLng = true;
    }
    if(maxLng){
        maxLng = parseFloat(maxLng);        
        if(isNaN(maxLng) || maxLng < -180 || maxLng > 180) {
            const err = new Error();
            err.status = 400;
            err.message = "Bad Request";
            err.errors = {page: "Maximum longitude is invalid"};
            return next(err)
        }        
        checkMaxLng = true;
    }
    if(checkMinLng && checkMaxLng){
        if(minLng > maxLng){
            const err = new Error();
            err.status = 400;
            err.message = "Bad Request";
            err.errors = {page: "Maximum longitude must be greater or equal to minimum longitude"};
            return next(err)
        }        
        where.lng = { [Op.between]: [minLng, maxLng] };
    }
    if(checkMinLng && !checkMaxLng){
        where.lng = { [Op.gte]: minLng };
    }
    if(!checkMinLng && checkMaxLng){
        where.lng = { [Op.lte]: maxLng}
    }

    //price
    let checkMinPrice;
    let checkMaxPrice;

    if(minPrice){
        minPrice = parseFloat(minPrice);
        if(isNaN(minPrice) || minPrice < 0) {
            const err = new Error();
            err.status = 400;
            err.message = "Bad Request";
            err.errors = {page: "Minimum price must be greater than or equal to 0"};
            return next(err)
        }
        checkMinPrice = true;
    }
    if(maxPrice){
        maxPrice = parseFloat(maxPrice);        
        if(isNaN(maxPrice) || maxPrice < 0) {
            const err = new Error();
            err.status = 400;
            err.message = "Bad Request";
            err.errors = {page: "Maximum price must be greater than or equal to 0"};
            return next(err)
        }        
        checkMaxPrice = true;
    }
    if(checkMinPrice && checkMaxPrice){
        if(minPrice > maxPrice){
            const err = new Error();
            err.status = 400;
            err.message = "Bad Request";
            err.errors = {page: "Maximum price must be greater than or equal to minimum price"};
            return next(err)
        }        
        where.price = { [Op.between]: [minPrice, maxPrice] };
    }
    if(checkMinPrice && !checkMaxPrice){
        where.price = { [Op.gte]: minPrice };
    }
    if(!checkMinPrice && checkMaxPrice){
        where.price = { [Op.lte]: maxPrice}
    }

    //find spots
    let allSpots = await Spot.findAll({
        where,
        ...pagination
    });

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
            ele.dataValues.avgRating = 'New';
        }

        //add previewImage
        const previewImgs = await SpotImage.findAll({
            attributes: ['url'],
            where: {
                spotId: ele.id,
                preview: true
            }
        });
        
        if(previewImgs.length > 0){
            ele.dataValues.previewImage = previewImgs[0].url;
        }else{
            ele.dataValues.previewImage = "No preview image";
        }
    }

    res.json({
        Spots: allSpots,
        page,
        size
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
            ele.dataValues.avgRating = (sumOfStars/countOfReviews);
        }else{
            ele.dataValues.avgRating = 'New';
        }

        const previewImgs = await SpotImage.findAll({
            attributes: ['url'],
            where: {
                spotId: ele.id,
                preview: true
            }
        });
        
        if(previewImgs.length > 0){
            ele.dataValues.previewImage = previewImgs[0].url;
        }else{
            ele.dataValues.previewImage = "No preview image";
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
        let num = sumOfStars/numReviews;
        if(Number.isInteger(num)){
            spot.dataValues.avgStarRating = Number.parseFloat(num).toFixed(1)
        }else{
            spot.dataValues.avgStarRating = Number.parseFloat(num).toFixed(2)
        }
    }else{
        spot.dataValues.avgStarRating = 'New'
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