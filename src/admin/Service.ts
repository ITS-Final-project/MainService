import axios from "axios";
import jwtConfiguration from "../configuration/jwtConfiguration";
import { USSecret } from "../configuration/secretConfiguration";

export class AdminService {
    private static _instance: AdminService;

    public static getInstance(): AdminService {
        if (!AdminService._instance) {
            AdminService._instance = new AdminService();
        }

        return AdminService._instance;
    }

    private constructor() {}

    public async getRegStats(): Promise<any> {
        return new Promise((resolve, reject) => {
            const sendToken = jwtConfiguration.sign({send: true}, new USSecret())
            axios.get('http://localhost:3001/user/regstats',
                {
                    data: {
                        token: sendToken
                    }
                }
            ).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public async editUser(id: string, username: string, email: string, password: string, admin: boolean): Promise<any> {
        return new Promise((resolve, reject) => {

            var roles = ['user']

            if (admin) {
                roles.push('admin');
            }

            var sections = ['information', 'roles']

            if (password) {
                sections.push('passwordAdmin');
            }

            var signData = {
                id: id,
                body: {
                    username: username,
                    email: email,
                    password: password,
                    roles: roles,
                    section: sections
                }
            }

            const sendToken = jwtConfiguration.sign(signData, new USSecret())

            axios.post('http://localhost:3001/user/edit',
                {
                    token: sendToken
                }
            ).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}