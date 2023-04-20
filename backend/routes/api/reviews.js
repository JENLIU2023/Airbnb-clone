const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

//get all reviews of current user
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;

    const reviews = await Review.findAll({
        where: {
            userId: user.id
        }
    });
    const currentUser = await User.findByPk(user.id, {
        attributes: ['id', 'firstName', 'lastName']
    })

    for(let review of reviews){
        const spot = await Spot.findByPk(review.spotId, {
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt']
            }
        })
        const reviewImage = await ReviewImage.findAll({
            where: {
                reviewId: review.id
            },
            attributes: ['id', 'url']
        })
        spot.dataValues.previewImage = reviewImage[0].url;

        review.dataValues.User = currentUser;
        review.dataValues.Spot = spot;
        review.dataValues.ReviewImages = reviewImage;
    }

    res.json({
        Reviews: reviews
    })
})

//add an image to a review based on the review's id
router.post('/:reviewId/images', requireAuth, async(req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const { user } = req;

    const review = await Review.findByPk(reviewId);

    if(!review){
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }

    if(review.userId === user.id){
        const count = await ReviewImage.count({
            where: {
                reviewId: reviewId
            }
        });
        if(count >= 10){
            return res.status(403).json({
                message: "Maximum number of images for this resource was reached"
            })
        }

        const newImg = await ReviewImage.create({
            reviewId,
            url
        });
        const result = await ReviewImage.findByPk(newImg.id, {
            attributes: ['id', 'url']
        })
        return res.json(result)
    }else{
        res.status(403).json({
            message: "Forbidden"
        })
    }
})

//edit a review
router.put('/:reviewId', requireAuth, handleValidationErrors, async(req, res) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const { user } = req;

    const reviews = await Review.findByPk(reviewId);
    if(!reviews){
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }

    if(reviews.userId === user.id){
        reviews.review = review;
        reviews.stars = stars;

        await reviews.save();
        return res.json(reviews);
    }else{
        res.status(403).json({
            message: "Forbidden"
        })
    }
})

//delete a review
router.delete('/:reviewId', requireAuth, async(req, res) => {
    const { reviewId } = req.params;
    const { user } = req;

    const review = await Review.findByPk(reviewId);
    if(!review){
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }

    if(review.userId === user.id){
        await review.destroy();
        return res.json({message: "Successfully deleted"})
    }else{
        res.status(403).json({
            message: "Forbidden"
        })
    }
})

module.exports = router;