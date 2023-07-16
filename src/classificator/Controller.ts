import express from 'express';
import axios from 'axios';

import { USSecret } from '../configuration/secretConfiguration';
import { AuthorizationHandler } from '../authorization/authorization';
import { AuthenticationHandler } from '../authentication/authentication';
import { ClassificatorService } from './Service';

import { CredsConfiguration } from '../configuration/credsConfigurations';

const router = express.Router();

export class ClassificatorController {
    public static _instance: ClassificatorController;
    private _authorizationHandler: AuthorizationHandler;
    private _authenticationHandler: AuthenticationHandler;

    private _classificatorService: ClassificatorService;

    private PY_URL = CredsConfiguration.PY_HOST + ':' + CredsConfiguration.PY_PORT;

    private constructor(authorizationHandler?: AuthorizationHandler, authenticationHandler?: AuthenticationHandler) {
        this._authorizationHandler = authorizationHandler || AuthorizationHandler.getInstance();
        this._authenticationHandler = authenticationHandler || AuthenticationHandler.getInstance();
        this._classificatorService = ClassificatorService.getInstance();

        router.get('/service/check', (req, res) => {
            this._classificatorService.checkService().then(() => {
                res.status(200).send({ status: 'OK' });
            }).catch(() => {
                res.status(500).send({ status: 'ERROR' });
            });
        })

        router.get('/', this._authorizationHandler.checkSession(), (req, res) => {
            res.render('classificator.ejs', 
            { 
                title: 'Classificator',
                user: this._authenticationHandler.getUser(req, res)
             });
        });

        router.post('/classify', this._authorizationHandler.checkSession(), (req, res) => {
            // Get data from canvas
            const data = req.body.imgBase64;
            const trainMode = req.body.trainMode;
            const label = req.body.label;

            if (!data) {
                res.status(400).send('No image data');
                return;
            }

            console.log('Train mode: ' + trainMode);
            console.log('Label: ' + label);

            // Send data to classificator
            axios.post(`${this.PY_URL}/classificator/classify`, {
                data: {
                    imgBase64: data,
                    trainMode: trainMode,
                    label: label
                }
            }).then((response) => {
                console.log(response.data);
                res.status(200).send(response.data);
            }).catch((error) => {
                // console.log(error);
                res.status(400).send(error);
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