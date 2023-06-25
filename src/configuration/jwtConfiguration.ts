import jwt from 'jsonwebtoken';
import { ISecret } from './secretConfiguration';

const jwtConfiguration = {
    sign: (payload: any, secret: ISecret) => {
        return jwt.sign(payload, secret.getSecret(), { algorithm: 'HS256' });
    },
    verify: (token: string, secret: ISecret) => {
        return jwt.verify(token, secret.getSecret(), { algorithms: ['HS256'] });
    }
};

export default jwtConfiguration;

