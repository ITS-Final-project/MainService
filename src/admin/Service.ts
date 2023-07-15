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
}