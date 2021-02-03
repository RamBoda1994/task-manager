const express = require('express');
const User = require('./../models/user');
const auth = require('./../middleware/auth');
const upload = require('./../middleware/multer');
const sharp = require('sharp');

const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({
            user,
            token
        });
    }
    catch(e) {
        res.status(400).send(e);
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({
            user: user,
            token
        });
    }
    catch(e){
        res.status(400).send();
    }
})

// router.get('/users', auth, async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     }
//     catch(e){
//         res.status(500).send(e);
//     }
// })
router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter(tokenObj => tokenObj.token !== req.token);
        await req.user.save();
        res.send();
    }
    catch(e){
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }
    catch(e){
        res.status(500).send(e);
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

// router.get('/users/:id', async (req, res) => {
//     const userId = req.params.id;
//     try {
//         const user = await User.findById(userId);
//         if(!user){
//             return res.status(404).send();
//         }
//         res.send(user);
//     }
//     catch(e) {
//         res.status(500).send(e);
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'password', 'email', 'age'];
    const validUpdate = updates.every(update => allowedUpdates.includes(update));

    if(!validUpdate){
        return res.status(400).send({
            error: 'Invalid updates!'
        })
    }
    try {
        // const user = await User.findById(req.params.id);
        // const user = req.user;
        updates.forEach(update => {
            req.user[update] = req.body[update];
        })
        await req.user.save();
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })
        res.send(req.user);
    }
    catch(e){
        res.status(400).send(e);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id);
        // if(!user){
        //     return res.status(404).send();
        // }
        await req.user.remove();
        res.send(req.user);
    }
    catch(e) {
        res.status(500).send(e);
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png.toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send('Avatar is updated successfully');
},(error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send('Avatar is removed successfully');
    }
    catch(e){
        res.status(500).send();
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Typ','image/jpg');
        res.send(user.avatar);
    }
    catch(e){
        res.status(404).send();
    }
})

module.exports = router;