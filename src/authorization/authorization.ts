import { ISecret, USSecret } from "../configuration/secretConfiguration";
import { JwtPayload } from "jsonwebtoken";
import jwtConfiguration from "../configuration/jwtConfiguration";

import axios, { Axios } from "axios";

export interface IAuthorizationHandler {
    verify(token: string, secret: ISecret): JwtPayload;
    verify(secret: ISecret): (req: any, res: any, next: any) => void;
    sign(payload: any, secret: ISecret): string;

    checkSession(): (req: any, res: any, next: any) => void;
}

export class AuthorizationHandler implements IAuthorizationHandler {

    private static _instance: AuthorizationHandler;

    private constructor() { }
    
    public static getInstance(): AuthorizationHandler {
        if (!AuthorizationHandler._instance) {
            AuthorizationHandler._instance = new AuthorizationHandler();
        }

        return AuthorizationHandler._instance;
    }

    verify(token: string, secret: ISecret): JwtPayload;
    verify(secret: ISecret): (req: any, res: any, next: any) => void;
    verify(tokenOrSecret: any, secret?: any): any {
        if (typeof tokenOrSecret === 'string') {
            if (!secret) {
                throw new Error('Secret is required');
            }

            return jwtConfiguration.verify(tokenOrSecret, secret);
        } else {
            return (req: any, res: any, next: any) => {
                var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.auth;

                if (!token) {
                    res.status(401).send('Unauthorized');
                    return;
                }

                try {
                    var data = jwtConfiguration.verify(token, tokenOrSecret);
                    res.locals.data = data;
                    next();
                } catch (err) {
                    res.status(401).send('Unauthorized');
                }
            }
        }
    }
    
    sign(payload: any, secret: ISecret): string {
        return jwtConfiguration.sign(payload, secret);
    }

    checkSession(): (req: any, res: any, next: any) => void {
        return (req: any, res: any, next: any) => {
            var toPage = req.originalUrl;
            console.log("Target page: " + toPage);
            var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.auth;

            if (!token) {
                console.log('Error: token is not provided');
                res.cookie('toPage', toPage, { httpOnly: true });
                res.redirect('/user/login');
                return;
            }

            axios.post('http://localhost:3001/user/checkSession', {
                token: token
            }).then((response) => {
                var token = response.data.token;

                if (!token) {
                    console.log('Error: token is not valid');
                    res.cookie('toPage', toPage, { httpOnly: true });

                    res.redirect('/user/login');
                    return;
                }

                var decodedToken = jwtConfiguration.verify(token, new USSecret());
                next();
            }).catch((error) => {
                console.log(error);
                res.cookie('toPage', toPage, { httpOnly: true });
                
                res.redirect('/user/login');
            });
        }
    }

    clearToPage(): (req: any, res: any, next: any) => void {
        return (req: any, res: any, next: any) => {
            // If not going to login page, clear toPage cookie
            if (req.originalUrl !== '/user/login') {
                res.clearCookie('toPage');
            }
            next();

        }
    }
}