const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage } = require('../../db/models')

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
        ele.dataValues.avgRating = sumOfStars/countOfReviews;

        //add previewImage
        const preview = await SpotImage.findAll({
            attributes: ['url'],
            where: {
                spotId: ele.id
            }
        });
        ele.dataValues.previewImage = preview[0].url;
    }

    res.json({
        Spots: allSpots
    });
})


module.exports = router;