import express from 'express';
import axios from 'axios';

import jwtConfiguration from '../configuration/jwtConfiguration'
import { Jwt } from 'jsonwebtoken';
import { USSecret } from '../configuration/secretConfiguration';

const url = require('url');

const router = express.Router();

export class UserController {
    private static _instance: UserController;

    private constructor() {

        //* Login
        //* Body: { token: string }
        //* Response: { loginPage: string }
        //* Sends request to user service to get login page
        router.get('/login', (req, res) => {
            var token = jwtConfiguration.sign({ data: 'login' }, new USSecret());
            axios.get('http://localhost:3001/user/login', {
                data: {
                    token: token
                }                    
            }).then((response) => {
                var loginPage = response.data;

                if (!loginPage) {
                    console.log('Error');
                    res.status(500).send('Internal server error');
                    return;
                }

                res.render('login.ejs', { loginPage: loginPage, error: req.query.error });
            }).catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error');
            });
        })

        //* Register
        //* Body: { badFields: string[], message: string}
        //* Response: { token: string }
        //* Sends request to user service to get register page
        router.get('/register', (req, res) => {
            var token = jwtConfiguration.sign({ data: 'register' }, new USSecret());

            axios.get('http://localhost:3001/user/register', {
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
                res.render('register.ejs', { registerPage: registerPage, badFields: req.query.badFields, message: req.query.message });
            }).catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error');
            });
        })

        // ! ==================== POST METHODS ====================
        
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

            axios.post('http://localhost:3001/user/login', {
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
            
            axios.post('http://localhost:3001/user/register', {
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