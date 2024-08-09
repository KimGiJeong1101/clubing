const express = require('express');
const Club = require('../models/Club');
const Meeting = require('../models/Meeting');
const router = express.Router();



//리스트 보여주기
router.get('/', async (req, res, next) => {
    try {
        console.log('여긴');    
        const clubs = await Club.find();
        res.status(200).json(clubs);
    } catch (error) {
        next(error)
    }
})

//클럽 만들기(POST)
router.post('/create', async (req, res, next) => {
    try {
        //region 서울시 동작구 노량진동 이런거 띄어쓰기 단위로 잘라서 객체화 !!
        let region = req.body.region.split(' ');//지역나누기
        const addressObject = {
            city: region[0],
            district: region[1],
            neighborhood: region[2]
        };
        req.body.region = addressObject;
        //region 서울시 동작구 노량진동 이런거 띄어쓰기 단위로 잘라서 객체화 !!.end

        //서브카테고리 나누기
        let subCategory = req.body.subCategory.split('/');
        req.body.subCategory = subCategory;
        //서브카테고리 나누기.end

        const club = new Club(req.body);
        await club.save();
        return res.sendStatus(200);
    } catch (error) {
        next(error)
    }
})

//클럽 보여주기(GET)
router.get('/read/:id', async (req, res, next) => {
    try {
        console.log('여긴22');
        console.log(req.params.id);   
        const clubs = await Club.findById({_id : req.params.id});
        res.status(200).json(clubs);
    } catch (error) {
        next(error)
    }
})

//클럽 보여주기(수정 , GET)
router.get('/read2/:id', async (req, res, next) => {
    try {
        
        console.log('여긴232');
        console.log(req.params.id);   
        const clubs = await Club.findById({_id : req.params.id});
        const meetings = await Meeting.find({clubNumber : req.params.id});
        console.log(meetings);
        clubs.meeting=meetings;
        res.status(200).json(clubs);
    } catch (error) {
        next(error)
    }
})

router.delete('/delete/:id', async (req, res, next) => {
    try {
                
        const clubs = await Club.findByIdAndDelete({_id : req.params.id});
        return res.sendStatus(200);
    } catch (error) {
        next(error)
    }
})

router.post('/update/:id', async (req, res, next) => {
    try {

        //서브카테고리 나누기
        let subCategory = req.body.subCategory.toString().split(',');
        //서브카테고리 나누기.end
        console.log(req.body);
        req.body.subCategory = subCategory
        const updatedClub = await Club.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // 업데이트 후 새 객체를 반환
        );
        return res.sendStatus(200);
    } catch (error) {
        next(error)
    }
})


module.exports = router;