import { LogRepository } from "./logRepository";
import { LogHandler } from "./logHandler";

import express from 'express';
import axios from 'axios';
import { LogService } from "./logService";

var router = express.Router();

const logHandler = new LogHandler();

export class LogController {
    private _service: LogService;
    private static _instance: LogController;


    public static getInstance(): LogController {
        if (!LogController._instance) {
            LogController._instance = new LogController();
        }

        return LogController._instance;
    }

    private constructor() {

        this._service = LogService.getInstance();

        router.get('/list', async (req, res) => {
            // Returns a list of all log files
            var data = await this._service.getAll();

            res.send(data);
        });

        router.get('/get/:service/:name', async (req, res) => {
            // Returns a list of all log files
            console.log(req.params.name);
            console.log(req.params.service);

            var level = req.query.level;
            var origin = req.query.origin;
            var action = req.query.action;
            var service = req.params.service;
            var name = req.params.name;   
            
            var filter = {} as any;
            
            if(level)
                filter.level = level;
            
            if(origin)
                filter.origin = origin;
            
            if(action)
                filter.action = action;

            var data = await this._service.getLogValueByFilter(name, filter, service);
            console.log("DATA: " + data);
            res.send(data);
        });
    }

    public getRouter() {
        return router;
    }
    
}