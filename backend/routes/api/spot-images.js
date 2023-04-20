const express = require('express');
const router = express.Router();
const { Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//delete a spot image
router.delete('/:imageId', requireAuth, async(req, res) => {
    const { imageId } = req.params;
    const { user } = req;

    const img = await SpotImage.findByPk(imageId, {
        include: Spot
    });
    if(!img){
        return res.status(404).json({
            message: "Spot Image couldn't be found"
        })
    }

    if(user.id === img.Spot.ownerId){
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