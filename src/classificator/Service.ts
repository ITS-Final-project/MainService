import axios from 'axios';

export class ClassificatorService {
    private static _instance: ClassificatorService;

    public static getInstance(): ClassificatorService {
        if (!ClassificatorService._instance) {
            ClassificatorService._instance = new ClassificatorService();
        }

        return ClassificatorService._instance;
    }

    private constructor() {}

    public async checkService(): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:3002/py/service/check').then((response) => {
                resolve(true);
            }).catch((error) => {
                reject();
            });
        });
    }
}