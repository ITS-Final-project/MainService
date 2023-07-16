import express from 'express';
import axios from 'axios';

import jwtConfiguration from '../configuration/jwtConfiguration'
import { Jwt, JwtPayload } from 'jsonwebtoken';
import { USSecret } from '../configuration/secretConfiguration';

import { AuthenticationHandler } from '../authentication/authentication';
import { AuthorizationHandler } from '../authorization/authorization';
import { UserService } from './Service';

import { CredsConfiguration } from '../configuration/credsConfigurations';

const url = require('url');

const router = express.Router();

export class UserController {
    private static _instance: UserController;

    private _authenticationHandler: AuthenticationHandler;
    private _authorizationHandler: AuthorizationHandler;

    private _userService: UserService;


    private US_URL = CredsConfiguration.US_HOST + ':' + CredsConfiguration.US_PORT;

    private constructor(authenticationHandler?: AuthenticationHandler, authorizationHandler?: AuthorizationHandler) {

        this._userService = UserService.getInstance();
        this._authenticationHandler = authenticationHandler || AuthenticationHandler.getInstance();
        this._authorizationHandler = authorizationHandler || AuthorizationHandler.getInstance();

        router.get('/service/check', (req, res) => {
            this._userService.checkService().then(() => {
                res.status(200).send({ status: 'OK' });
            }).catch(() => {
                res.status(500).send({ status: 'ERROR' });
            });
        })

        //* Login
        //* Body: { token: string }
        //* Response: { loginPage: string }
        //* Sends request to user service to get login page
        router.get('/login', (req, res) => {
            var token = jwtConfiguration.sign({ data: 'login' }, new USSecret());
            axios.get(`${this.US_URL}/user/login`, {
                data: {
                    token: token
                }                    
            }).then((response) => {
                var loginPage = response.data;

                if (!loginPage) {
                    console.log('Error');
                    res.render('error_page.ejs', { user: this._authenticationHandler.getUser(req, res) })
                }

                res.render('login.ejs', 
                { 
                    loginPage: loginPage, 
                    error: req.query.error,
                    user: this._authenticationHandler.getUser(req, res)
                });
            }).catch((error) => {
                res.render('error_page.ejs', { user: this._authenticationHandler.getUser(req, res) })
            });
        })

        //* Register
        //* Body: { badFields: string[], message: string}
        //* Response: { token: string }
        //* Sends request to user service to get register page
        router.get('/register', (req, res) => {
            var token = jwtConfiguration.sign({ data: 'register' }, new USSecret());

            axios.get(`${this.US_URL}/user/register`, {
                data: {
                    token: token
                }                    
            }).then((response) => {
                var registerPage = response.data;

                if (!registerPage) {
                    console.log('Error');
                    res.status(500).send('Internal server error');
                    return;
                }
                res.render('register.ejs', 
                { 
                    registerPage: registerPage, 
                    badFields: req.query.badFields, 
                    message: req.query.message,
                    user: this._authenticationHandler.getUser(req, res)
                });
            }).catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error');
            });
        })

        //* Logout
        //* Body: { token: string }
        //* Response: { location: string }
        router.get('/logout', (req, res) => {
            var token = req.cookies.auth;

            if (!token) {
                res.redirect('/');
                return;
            }

            axios.post(`${this.US_URL}/user/logout`, {
                token: token
            }).then((response) => {
                res.clearCookie('auth');
                res.redirect('/');
            }).catch((error) => {
                res.redirect('/');
            });
        });

        //* Dashboard
        //* Body: { token: string }
        //* Response: { dashboardPage: string }
        router.get('/admin/dashboard', this._authorizationHandler.checkRole('admin'), (req, res) => {
            res.render('admin_dashboard.ejs', 
            { 
                title: 'Admin dashboard',
                user: this._authenticationHandler.getUser(req, res)
            });
        });

        //* Profile
        //* Body: { token: string }
        //* Response: { profilePage: string ; token: cookie }
        router.get('/profile', (req, res) => {
            var token = req.cookies.auth;

            if (!token) {
                res.redirect('/');
                return;
            }

            axios.get(`${this.US_URL}/user/profile`, {
                data: {
                    token: token
                }
            }).then((response) => {
                var token = response.headers['set-cookie']?.at(0)?.split(';')[0].split('=')[1];

                if (!token) {
                    console.log('Error');
                    res.redirect('/');
                    return;
                }

                var decodedToken = jwtConfiguration.verify(token, new USSecret());

                if (!decodedToken) {
                    console.log('Error');
                    res.redirect('/');
                    return;
                }

                var profilePage = response.data;

                if (!profilePage) {
                    console.log('Error');
                    res.redirect('/');
                    return;
                }

                res.cookie('auth', token, { httpOnly: true });

                res.render('profile.ejs', 
                { 
                    profilePage: profilePage, 
                    user: this._authenticationHandler.getUser(req, res)
                });
            }).catch((error) => {
                console.log(error);
                res.redirect('/');
            });
        })

       
        // ! ==================== POST METHODS ====================

        router.post('/delete', (req, res) => {
            // Check if password was passed
            var password = req.body.password;

            if (!password) {
                res.redirect('/user/profile');
                return;
            }

            // Get selfId from token 

            var token = req.cookies.auth;

            if (!token) {
                res.redirect('/');
                return;
            }

            var decodedToken = jwtConfiguration.verify(token, new USSecret()) as JwtPayload;

            if (!decodedToken) {
                res.redirect('/');
                return;
            }

            var user = decodedToken.user;

            if (!user) {
                res.redirect('/');
                return;
            }

            var id = user.id;

            this._userService.deleteUser(id, password).then(() => {
                res.clearCookie('auth');
                res.redirect('/');
            }).catch(() => {
                res.redirect('/user/profile');
            });

        })

        router.post('/edit', (req, res) => {
            var token = req.cookies.auth;

            if (!token) {
                res.redirect('/');
                return;
            }

            var decodedToken = jwtConfiguration.verify(token, new USSecret()) as JwtPayload;

            if (!decodedToken) {
                res.redirect('/');
                return;
            }

            var user = decodedToken.user;

            if (!user) {
                res.redirect('/');
                return;
            }

            var editToken = jwtConfiguration.sign({ body: req.body, id: user.id }, new USSecret());

            axios.post(`${this.US_URL}/user/edit`, {
                token: editToken
            }).then((response) => {
                var token = response.data.token;

                if (!token) {
                    res.redirect('/user/profile');
                    return;
                }

                var decodedToken = jwtConfiguration.verify(token, new USSecret());
                
                if (!decodedToken) {
                    res.redirect('/user/profile');
                    return;
                }

                res.cookie('auth', token, { httpOnly: true });

                res.redirect('/user/profile');
            }).catch((error) => {
                console.log(error);
                res.redirect('/user/profile');
            });
        })

        //* Count
        //* Body: { username: string, email: string, roles: string[] }
        //* Response: { count: number }
        //* Sends request to user service to count users
        router.post('/count', (req, res) => {
            
            var username = req.body.username;
            var email = req.body.email;
            var role = req.body.role;
            
            var token = req.cookies.auth;

            if (!token) {
                res.redirect('/');
                return;
            }

            var countToken = jwtConfiguration.sign({username: username, email: email, role: role}, new USSecret());

            axios.post(`${this.US_URL}/user/count`, {
                token: countToken,
            }).then((response) => {
                var count = response.data;

                if (!count) {
                    console.log('Error');
                    res.status(500).send('Internal server error');
                    return;
                }

                res.json(count);
            }).catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error');
            });

        })

        //* Search
        //* Body: { username: string, email: string, roles: string[], pagesize: number, pagenumber: number }
        //* Response: { users: User[] }
        //* Sends request to user service to search users
        router.post('/search', (req, res) => {
            console.log(req.body);
            var userame = req.body.username;
            var email = req.body.email;
            var roles = req.body.roles;

            var pagesize = req.body.pagesize;
            var pagenumber = req.body.pagenumber;

            var token = req.cookies.auth;

            if (!token) {
                res.redirect('/');
                return;
            }

            var searchToken = jwtConfiguration.sign({username: userame, email: email, roles: roles, pagesize: pagesize, pagenumber: pagenumber}, new USSecret());

            axios.post(`${this.US_URL}/user/search`, {
                token: searchToken,
            }).then((response) => {
                var searchedUsers = response.data;

                if (!searchedUsers) {
                    console.log('Error');
                    res.status(500).send('Internal server error');
                    return;
                }

                res.json(searchedUsers);
            }).catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error');
            });

        })
        
        //* Login
        //* Body: { usernameOrEmail: string, password: string }
        //* Response: { token: string }
        //* Sends request to user service to login user
        router.post('/login', (req, res) => {
            var body = req.body;

            if (!body) {
                res.status(400).send('Bad request');
                return;
            }

            var token = jwtConfiguration.sign({ body: body }, new USSecret());

            axios.post(`${this.US_URL}/user/login`, {
                token: token
            }).then((response) => {
                var token = response.data.token;
                res.clearCookie('token');

                if (!token) {
                    res.redirect('/user/login');
                    return;
                }

                var decodedToken = jwtConfiguration.verify(token, new USSecret());
                if (!decodedToken) {
                    res.redirect('/user/login');
                    return;
                }
                
                res.cookie('auth', token, { httpOnly: true });
                res.redirect(req.cookies.toPage || '/')
            }
            ).catch((error) => {
                res.redirect(url.format({
                    pathname: "/user/login",
                    query: { error: 1 }
                    }));
            });
        });

        //* Register
        //* Body: { login: string, password: string, email: string }
        //* Response: { token: string }
        //* Sends request to user service to register user
        router.post('/register', (req, res) => {
            var body = req.body;

            if (!body) {
                res.status(400).send('Bad request');
                return;
            }

            var token = jwtConfiguration.sign({ body: body }, new USSecret());
            
            axios.post(`${this.US_URL}/user/register`, {
                token: token
            }).then((response) => {
                var token = response.data.token;

                if (!token) {
                    res.redirect('/user/register');
                    return;
                }

                var decodedToken = jwtConfiguration.verify(token, new USSecret());

                if (!decodedToken) {
                    res.redirect('/user/register');
                    return;
                }

                res.redirect('/user/login');
            }).catch((error) => {

                // If error, redirect to register page with error message
                try{
                    req.query.message = error.response.data.message;
                    req.query.badFields = error.response.data.badFields;
                }catch{}

                res.redirect(url.format({
                    pathname: "/user/register",
                    query: req.query
                }));
                
            });
        })
    }

    public static getInstance(): UserController {
        if (!UserController._instance) {
            UserController._instance = new UserController();
        }

        return UserController._instance;
    }

    public getRouter(): express.Router {
        return router;
    }
}