import express from 'express';
import path from 'path';

import cookieParser from 'cookie-parser';

import { UserController } from './user/Controller';
import { ClassificatorController } from './classificator/Controller';
import { AuthorizationHandler } from './authorization/authorization';
import { AuthenticationHandler } from './authentication/authentication';
import { AdminController } from './admin/Controller';
import cors from 'cors';

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

// Register controllers
app.use('/user', userController.getRouter());
app.use('/classificator', classificatorController.getRouter());
app.use('/admin', adminController.getRouter());

app.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Express', user: AuthenticationHandler.getInstance().getUser(req, res) });

    }
);

app.get('*', (req, res) => {
    res.render('error_page.ejs', { user: AuthenticationHandler.getInstance().getUser(req, res) })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);