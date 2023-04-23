const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

//get all of the current user's bookings
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;

    const bookings = await Booking.findAll({
        where: {
            userId: user.id
        }
    })

    for(let booking of bookings){
        booking.dataValues.startDate = booking.dataValues.startDate.toISOString().split('T')[0];
        booking.dataValues.endDate = booking.dataValues.endDate.toISOString().split('T')[0];

        const spot = await Spot.findByPk(booking.dataValues.spotId, {
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt']
            }
        });
        const img = await SpotImage.findAll({
            where: {
                spotId: spot.id,
                preview: true
            }
        });
        if(img.length > 0){
            spot.dataValues.previewImage = img[0].url;    
        }else{
            spot.dataValues.previewImage = "No preview image"
        }
        booking.dataValues.Spot = spot;
    }

    res.json({
        Bookings: bookings
    })
})

//edit a booking
router.put('/:bookingId', requireAuth, handleValidationErrors, async(req, res, next) => {
    const { bookingId } = req.params;
    const { user } = req;
    const { startDate, endDate } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if(!booking){
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    }

    if(user.id === booking.userId){
        if(new Date(endDate).getTime() < new Date().getTime()){
            const err = new Error();
            err.status = 403;
            err.message = "Past bookings can't be modified";
            return next(err)
        }

        if(new Date(startDate).getTime() >= new Date(endDate).getTime()){
            const err = new Error();
            err.status = 400;
            err.message = "Bad Request";
            err.errors = {endDate: "endDate cannot come before startDate"};
            return next(err)
        }

        //check conflict bookings with other users'
        const allOtherBookings = await Booking.findAll({
            where: {
                spotId: booking.spotId,
                userId: {
                    [Op.ne]: user.id
                }
            }
        })

        for(let allb of allOtherBookings){
            const d1 = new Date(allb.startDate.toISOString().split('T')[0]).getTime();
            const d2 = new Date(startDate).getTime();
            const d3 = new Date(allb.endDate.toISOString().split('T')[0]).getTime();
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

        booking.dataValues.startDate = new Date(startDate).toISOString().split('T')[0];
        booking.dataValues.endDate = new Date(endDate).toISOString().split('T')[0];

        res.json(booking);

    }else{
        res.status(403).json({
            message: "Forbidden"
        })
    }
})

//delete a booking
router.delete('/:bookingId', requireAuth, handleValidationErrors, async(req, res, next) => {
    const { bookingId } = req.params;
    const { user } = req;

    const booking = await Booking.findByPk(bookingId);
    if(!booking){
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    }
    const spot = await Spot.findByPk(booking.spotId);
    if(booking.userId === user.id || spot.ownerId === user.id){
        const d1 = new Date(booking.startDate.toISOString().split('T')[0]).getTime();
        const d2 = new Date().getTime();

        if(d2 >= d1){
            const err = new Error();
            err.status = 403;
            err.message = "Bookings that have been started can't be deleted";
            return next(err)
        }

        await booking.destroy();
        res.json({
            message: "Successfully deleted"
        })
    }else{
        res.status(403).json({
            message: "Forbidden"
        })
    }
})

module.exports = router;