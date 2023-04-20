const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//delete a review image
router.delete('/:imageId', requireAuth, async(req, res) => {
    const { imageId } = req.params;
    const { user } = req;

    const img = await ReviewImage.findByPk(imageId, {
        include: Review
    });
    if(!img){
        return res.status(404).json({
            message: "Spot Image couldn't be found"
        })
    }

    if(user.id === img.Review.userId){
        await img.destroy();
        return res.json({
            message: "Successfully deleted"
        })
    }else{
        res.status(403).json({
            message: "Forbidden"
        })
    }
})

module.exports = router;