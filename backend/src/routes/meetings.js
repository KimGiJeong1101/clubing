const express = require('express');
const Meeting = require('../models/Meeting');
const router = express.Router();


//클럽 만들기(POST)
router.post('/create', async (req, res, next) => {
    try {
        const meeting = new Meeting(req.body);
        await meeting.save();
        return res.sendStatus(200);
    } catch (error) {
        next(error)
    }
})

router.get('/delete/:id', async (req, res, next) => {
    try {
        const meeting = await Meeting.findByIdAndDelete({_id : req.params.id});
        if(meeting){

            return res.sendStatus(200).json(true);
        }else{
        return res.sendStatus(404).json(false);
        }
    } catch (error) {
        next(error)
    }
})


module.exports = router;