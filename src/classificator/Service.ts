import axios from 'axios';

import { CredsConfiguration } from '../configuration/credsConfigurations';

export class ClassificatorService {
    private static _instance: ClassificatorService;

    private PY_URL = CredsConfiguration.PY_HOST + ':' + CredsConfiguration.PY_PORT;

    public static getInstance(): ClassificatorService {
        if (!ClassificatorService._instance) {
            ClassificatorService._instance = new ClassificatorService();
        }

        return ClassificatorService._instance;
    }

    private constructor() {}

    public async checkService(): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(`${this.PY_URL}/py/service/check`).then((response) => {
                resolve(true);
            }).catch((error) => {
                reject();
            });
        });
    }
}