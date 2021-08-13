const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { logged_in, not_logged_in } = require('./status');
const router = express.Router();
// 회원가입
router.post('/join', not_logged_in, async (req, res, next) => {
    const { email, password, nickname, address } = req.body;
    try {
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            password: hash,
            nick: nickname,
            address,
        });
        // return res.redirect('http://localhost:3000/');
        return res.redirect('/');
    } catch(error) {
        console.error(error);
        return next(error);
    }
});
// 이메일 중복확인
router.get('/email?:email', async (req, res, next) => {
    console.log("= "+ req.query.email +" =");
    const email = req.query.email;
    try {
        const ex_email = await User.findOne({ where: { email } })
        if(ex_email) {
            return res.send(true);
        }else {
            return res.send(false);
        }
    } catch(error) {
        console.error(error);
        return next(error);
    }
});
// 닉네임 중복확인
router.get('/nick?:nick', async (req, res, next) => {
    const nick = req.query.nick;
    try {
        const ex_nick = await User.findOne({ where: { nick } })
        if (ex_nick) {
            return res.send(true);
        }else {
            return res.send(false);
        }
    } catch(error) {
        console.error(error);
        return next(error);
    }
});
// 로그인
router.post('/login', not_logged_in, (req, res, next) => {
    passport.authenticate('local', (auth_error, user, info) => {
        if(auth_error) {
            console.error(auth_error);
            return next(auth_error);
        }
        if(!user) {
            //
        }
        return req.logIn(user, (login_error) => {
            if (login_error) {
                console.error(login_error);
                return next(login_error);
            }
            // return res.send(user);
            // return res.redirect('http://localhost:3000');
            return res.redirect('/post');    
        });
    })(req, res, next);
});
// 로그아웃
router.get('/logout', logged_in, (req, res) => {
    req.logout();
    req.session.destroy();
    // res.redirect('http://localhost:3000/');
    return res.redirect('/');
});
// 카카오 로그인
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: 'http://localhost:3000/',
}), (req, res) => {
    res.redirect('http://localhost:3000/');
});

module.exports = router;