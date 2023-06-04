import express from 'express';
import path from 'path';

import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    
    res.render('index.ejs', { title: 'Express' });

    }
);

app.get('/classificator', (req, res) => {
        
    res.render('classificator.ejs', { title: 'Express' });

    }
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);