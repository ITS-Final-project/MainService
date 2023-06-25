import { JwtPayload } from 'jsonwebtoken';
import jwtConfiguration from '../configuration/jwtConfiguration';
import { USSecret } from '../configuration/secretConfiguration';

interface IAuthenticationHandler {
    getUser(req: any, res: any): any;
}

export class AuthenticationHandler implements IAuthenticationHandler {

    private static _instance: AuthenticationHandler;

    private constructor() { }

    public static getInstance(): AuthenticationHandler {
        if (!AuthenticationHandler._instance) {
            AuthenticationHandler._instance = new AuthenticationHandler();
        }

        return AuthenticationHandler._instance;
    }

    getUser(req: any, res: any): any {
        var token = req.cookies.auth;

        if (!token) {
            return {username: 'guest', email: 'guest'};
        }

        try {
            var data = jwtConfiguration.verify(token, new USSecret()) as JwtPayload;
            
            if (!data) {
                return {username: 'guest', email: 'guest'};
            }

            return {username: data.user.username, email: data.user.email};

        } catch (err) {
            
            return {username: 'guest', email: 'guest'};
        }
    }

}