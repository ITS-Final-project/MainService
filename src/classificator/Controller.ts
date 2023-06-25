import express from 'express';
import axios from 'axios';

import { USSecret } from '../configuration/secretConfiguration';
import { AuthorizationHandler } from '../authorization/authorization';
import { AuthenticationHandler } from '../authentication/authentication';

const router = express.Router();

export class ClassificatorController {
    public static _instance: ClassificatorController;
    private _authorizationHandler: AuthorizationHandler;
    private _authenticationHandler: AuthenticationHandler;

    private constructor(authorizationHandler?: AuthorizationHandler, authenticationHandler?: AuthenticationHandler) {
        this._authorizationHandler = authorizationHandler || AuthorizationHandler.getInstance();
        this._authenticationHandler = authenticationHandler || AuthenticationHandler.getInstance();

        router.get('/', this._authorizationHandler.checkSession(), (req, res) => {
            res.render('classificator.ejs', 
            { 
                title: 'Classificator',
                user: this._authenticationHandler.getUser(req, res)
             });
        });
    }

    public static getInstance(): ClassificatorController {
        if (!this._instance) {
            this._instance = new ClassificatorController();
        }

        return this._instance;
    }

    public getRouter(): express.Router {
        return router;
    }
}