import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();
const PORT = 3000;


try {
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use('/api', routes);

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });

} catch (error) {
    console.log(error)
}


