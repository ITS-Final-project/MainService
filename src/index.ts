import express from 'express';
import path from 'path';

import cookieParser from 'cookie-parser';

import { UserController } from './user/Controller';
import { ClassificatorController } from './classificator/Controller';
import { AuthorizationHandler } from './authorization/authorization';
import { AuthenticationHandler } from './authentication/authentication';
import { AdminController } from './admin/Controller';
import cors from 'cors';
import { LogHandler } from './logging/logHandler';
import { RouteWatcher } from './logging/routeWatcher';
import { LogController } from './logging/logController';

const logger = new LogHandler();
logger.open();

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(AuthorizationHandler.getInstance().clearToPage());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

// Get controllers
const userController = UserController.getInstance();
const classificatorController = ClassificatorController.getInstance();
const adminController = AdminController.getInstance();
const logController = LogController.getInstance();

// Register controllers
app.use('/user', userController.getRouter());
app.use('/classificator', classificatorController.getRouter());
app.use('/admin', adminController.getRouter());
app.use('/log', logController.getRouter());

app.get('/', RouteWatcher.logRoute('main'), (req, res) => {
    res.render('index.ejs', { title: 'Express', user: AuthenticationHandler.getInstance().getUser(req, res) });
});

app.get('/manual', (req, res) => {
    res.render('manual.ejs', { title: 'About', user: AuthenticationHandler.getInstance().getUser(req, res) });
})

app.get('*', (req, res) => {
    res.render('error_page.ejs', { user: AuthenticationHandler.getInstance().getUser(req, res) })
})

app.listen(port, () => {
    logger.info({
        origin: "HttpServer",
        action: "init",
        details: { serverType: "HttpServer", port: port },
      });
    console.log(`Example app listening at http://localhost:${port}`);
    }
);