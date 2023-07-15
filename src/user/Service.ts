import axios from 'axios';
import jwtConfiguration from '../configuration/jwtConfiguration';
import { USSecret } from '../configuration/secretConfiguration';
import { JwtPayload } from 'jsonwebtoken';

export class UserService {
    private static _instance: UserService;

    public static getInstance(): UserService {
        if (!UserService._instance) {
            UserService._instance = new UserService();
        }

        return UserService._instance;
    }

    private constructor() {}

    public async getUser(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const token = jwtConfiguration.sign({id: id}, new USSecret());

            axios.get('http://localhost:3001/user/get', {
                data: {
                    token: token
                }
            }).then((response) => {
                var user = response.data;

                if (!user) {
                    reject();
                }

                var decodedToken = jwtConfiguration.verify(user.token, new USSecret()) as JwtPayload;

                if (!decodedToken) {
                    reject();
                }

                if (!decodedToken.user) {
                    reject();
                }

                resolve(decodedToken.user);
            }).catch((error) => {
                console.log(error);
                reject();
            });
        })
    }   

    public async deleteUser(usedId: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {

            if (!usedId) {
                reject();
            }

            if (!password) {
                reject();
            }

            var sendToken = jwtConfiguration.sign({deleteId: usedId, password: password}, new USSecret());

            axios.post('http://localhost:3001/user/delete', {
                token: sendToken,
            }).then((response) => {

                var deletedUser = response.data;
    
                if (!deletedUser) {
                    reject();
                }
    
                resolve(deletedUser);
            }).catch((error) => {
                reject();
            });
        });
    }

    public async forceEdit(userId: string, user: any): Promise<any> {}

    public async editUser(userId: string, user: any): Promise<any> {

    }

    public async checkService(){
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:3001/us/service/check').then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}