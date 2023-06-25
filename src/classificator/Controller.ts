import express from 'express';
import axios from 'axios';

import { USSecret } from '../configuration/secretConfiguration';
import { AuthorizationHandler } from '../authorization/authorization';

const router = express.Router();

export class ClassificatorController {
    public static _instance: ClassificatorController;
    private _authorizationHandler: AuthorizationHandler;

    private constructor(authorizationHandler?: AuthorizationHandler) {
        this._authorizationHandler = authorizationHandler || AuthorizationHandler.getInstance();

        router.get('/', this._authorizationHandler.checkSession(), (req, res) => {
            res.render('classificator.ejs', { title: 'Classificator' });
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