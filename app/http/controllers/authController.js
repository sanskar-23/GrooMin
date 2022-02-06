const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport');

function authController() {
    return {
        login(req, res) {
            res.render('auth/login');
        },
        postLogin(req, res, next) {
            const { email, password } = req.body;
            // validate user
            if (!email || !password) {
                req.flash('error', 'All Fields are required!')
                return res.redirect('/login');
            }
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message);
                    return next(err);
                }
                if (!user) {
                    req.flash('error', info.message);
                    return res.redirect('/login');
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message);
                        return next(err);
                    }

                    return res.redirect('/');
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register');
        },
        async postRegister(req, res) {
            const { name, email, password } = req.body;
            // validate user
            if (!name || !email || !password) {
                req.flash('error', 'All Fields are required!')
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register');
            }
            // check if email exist in the database or not 
            User.exists({ email: email }, (err, result) => {
                    if (result) {
                        req.flash('error', 'Email already exist bro!');
                        req.flash('name', name);
                        req.flash('email', email);
                        return res.redirect('/register');
                    }
                })
                // hash password
            const hasedPassword = await bcrypt.hash(password, 10);
            // If everything goes well Create a user
            const user = new User({
                name: name,
                email: email,
                password: hasedPassword
            })
            user.save().then((user) => {
                // LOGIN
                return res.redirect('/');
            }).catch(err => {
                req.flash('error', 'Something Went wrong!');
                return res.redirect('/register');
            })
        },
        logout(req, res) {
            req.logout();
            return res.redirect('/login');
        }
    }
}

module.exports = authController;