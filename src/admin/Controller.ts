import express from 'express';
import axios from 'axios';

import { AuthenticationHandler } from '../authentication/authentication';
import { AuthorizationHandler } from '../authorization/authorization';

import { USSecret } from '../configuration/secretConfiguration';
import jwtConfiguration from '../configuration/jwtConfiguration';

const url = require('url');

const router = express.Router();

export class AdminController {
    private static _instance: AdminController;

    private _authenticationHandler: AuthenticationHandler;
    private _authorizationHandler: AuthorizationHandler;

    private constructor(authenticationHandler?: AuthenticationHandler, authorizationHandler?: AuthorizationHandler) {

        this._authenticationHandler = authenticationHandler || AuthenticationHandler.getInstance();
        this._authorizationHandler = authorizationHandler || AuthorizationHandler.getInstance();

        router.get('/dashboard', this._authorizationHandler.checkRole('admin'), this._authorizationHandler.getTempToken('us'), (req, res) => {
            res.render('admin_dashboard.ejs', 
            { 
                title: 'Admin dashboard',
                user: this._authenticationHandler.getUser(req, res)
            });
        });

        router.get('/users/list', this._authorizationHandler.checkRole('admin'), this._authorizationHandler.getTempToken('us'), (req, res) => {
            res.render('admin_users_list.ejs',
            {
                title: 'Users list',
                user: this._authenticationHandler.getUser(req, res)
            });
        });

        router.get('/user/delete', this._authorizationHandler.checkRole('admin'), (req, res) => {
            var id = req.query.id;

            var token = req.cookies.auth;

            if (!token) {
                res.redirect('/admin/users/list');
                return;
            }

            if (!id) {
                res.redirect('/admin/users/list');
                return;
            }

            var sendToken = jwtConfiguration.sign({deleteId: id}, new USSecret());

            axios.post('http://localhost:3001/user/delete', {
                token: sendToken,
            }).then((response) => {
                var deletedUser = response.data;

                if (!deletedUser) {
                    console.log('Error');
                    res.redirect('/admin/users/list');
                    return;
                }

                res.redirect('/admin/users/list');
            }).catch((error) => {
                console.log(error);
                res.redirect('/admin/users/list');
            });
        });

        router.post('/user/create', this._authorizationHandler.checkRole('admin') ,(req, res) => {
            var username = req.body.username;
            var email = req.body.email;
            var password = req.body.password;
            var admin = req.body.admin;

            var token = req.cookies.auth;

            var roles = ['user']

            if (!token) {
                res.redirect('/');
                return;
            }

            if (!username || !email || !password) {
                res.status(400).send('Bad request');
                return;
            }

            if (admin) {
                roles.push('admin');
            }

            var createToken = jwtConfiguration.sign({username: username, email: email, password: password, roles: roles}, new USSecret());

            axios.post('http://localhost:3001/user/create', {
                token: createToken,
            }).then((response) => {
                var createdUser = response.data;

                if (!createdUser) {
                    console.log('Error');
                    res.redirect('/admin/users/list');
                    return;
                }

                console.log(createdUser);

                res.redirect('/admin/users/list');
            }).catch((error) => {
                console.log(error);
                res.redirect('/admin/users/list');
            });
        })

    }

    public static getInstance(): AdminController {
        if (!AdminController._instance) {
            AdminController._instance = new AdminController();
        }

        return AdminController._instance;
    }

    public getRouter(): express.Router {
        return router;
    }
}