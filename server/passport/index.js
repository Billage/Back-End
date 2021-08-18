const passport = require('passport');
const local = require('./local');
const kakao = require('./kakao')
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // 세션에 user.id 저장
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id } })
        .then(user => done(null, user))
        .catch(err => done(err));
    });
    local();
    kakao();
};