import { ISecret, PYSecret } from "../configuration/secretConfiguration";
import { LogHandler } from "./logHandler";
import { LogRepository } from "./logRepository";
import jwtConfiguration from "../configuration/jwtConfiguration";
import axios from "axios";

var logHandler = new LogHandler();

export class LogService {
    private static _instance: LogService;
    private _repository: LogRepository;

    private constructor() {
        this._repository = new LogRepository(LogHandler.filePath.toString());
    }

    public static getInstance(): LogService {
        if (!LogService._instance) {
            LogService._instance = new LogService();
        }

        return LogService._instance;
    }

    async getAll(){
        var logs = {} as any;
        logs["MainService"] = this._repository.findAllLogFiles();
        var services = [
            // {
            //     name: "UserService",
            //     url: "http://localhost:3001/logs/list"
            // },
            {
                name: "AIService",
                url: "http://localhost:3002/logs/get",
                secret: new PYSecret()
            },
        ]

        for (var i = 0; i < services.length; i++) {
            var service = services[i];
            var result = await this.getServiceLog(service.url, service.secret);

            logs[service.name] = result.data.result;
        }

        return logs;
    }

    async getServiceLog(url: string, secret: ISecret){
        var token = jwtConfiguration.sign({send: true}, secret);
        return await axios.get(url,
            {
                data: {
                    token: token
                }
            });
    }


    async getLogByName(name: string){
        return await this._repository.findLogValueByFileName(name);
    }


    /**
     * 
     * @param name Name of the file to delete (with or without .json) -> will be parsed
     * @returns 
     */
    deleteLogByName(name: string){
        return this._repository.deleteLogFileByName(name);
    }


    /**
     * 
     * @param name Name of the file to search in (with or without .json) -> will be parsed
     * @param level Level of the log to search for (info, error, warning, debug) -> will be parsed to uppercase
     * @returns list of logs with the given level
     */
    getLogValueByLevel(name: string, level: string){
        return this._repository.findLogValueByLevel(name, level);
    }


    /**
     * 
     * @param name Name of the file to search in (with or without .json) -> will be parsed
     * @param date Date of the log to search for (timestamp) -> will be parsed to string
     * @returns list of logs with the given date
     */
    getLogValueByDate(name: string, date: Date){
        return this._repository.findLogValueByDate(name, date);
    }


    getLogValueByAction(name: string, action: string){
        return this._repository.findLogValueByAction(name, action);
    }


    /**
     * 
     * @param name Name of the file to search in (with or without .json) -> will be parsed
     * @param filter filter to search for (level, date, action) -> will be parsed to uppercase
     * @returns list of logs with the given filter
     * @example
     * Get all logs with level "INFO" and http method "GET"
     * 
     * getLogValueByFilter("log", {level: "INFO", method: "GET"})
     * 
     */
    async getLogValueByFilter(name: string, filter: any, service: string){

        if (service == "MainService") { 
            return await this._repository.findLogValueByFilter(name, filter);
        }

        var services = [
            // {
            //     name: "UserService",
            //     url: "http://localhost:3001/logs/list"
            // },
            {
                name: "AIService",
                url: "http://localhost:3002/logs/u/get"
            },
        ]

        var serviceStruct = services.find((s) => { return s.name == service });
        
        if (serviceStruct) {
            return axios.post(serviceStruct.url, {
                name: name,
                filter: filter
            }).then((response) => {
                return response.data.result;
            }).catch((error) => {
                console.log(error);
                return null;
            });
        };                    
    }


    getCurrentLogName(){
        return logHandler.getFileName();
    }
}