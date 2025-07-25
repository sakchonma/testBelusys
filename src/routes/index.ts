import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import studentRouter from './student';

const router = express.Router();

const options = {
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization'],
    credentials: true,
    methods: 'GET,OPTIONS,PUT,POST,DELETE',
    preflightContinue: false,
    origin: true,
};

router.use(cors(options));
router.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))
router.use('/student', studentRouter);

export default router;
