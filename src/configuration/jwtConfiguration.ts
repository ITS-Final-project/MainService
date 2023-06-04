import { IPrivateKey, IPublicKey } from './keyConfiguration';
import jwt from 'jsonwebtoken';

const jwtConfiguration = {
    sign: (payload: any, privateKey: IPrivateKey) => {
        return jwt.sign(payload, privateKey.getPrivateKey(), { algorithm: 'RS256' });
    },
    verify: (token: string, publicKey: IPublicKey) => {
        return jwt.verify(token, publicKey.getPublicKey(), { algorithms: ['RS256'] });
    }
};

export default jwtConfiguration;

// Example of use:
// Path: configuration\jwtConfiguration.ts
// import { MSKeyConfiguration } from './keyConfiguration';
// import jwtConfiguration from './jwtConfiguration';
// 
// const token = jwtConfiguration.sign({ id: 1 }, new MSKeyConfiguration());
// console.log(token);
//
// Path: configuration\jwtConfiguration.ts
// import { MSKeyConfiguration } from './keyConfiguration';
// import jwtConfiguration from './jwtConfiguration';
//
// const token = jwtConfiguration.sign({ id: 1 }, new MSKeyConfiguration());
// console.log(token);
