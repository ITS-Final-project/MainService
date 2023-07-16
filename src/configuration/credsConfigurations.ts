import dotenv from 'dotenv';

dotenv.config({path:'.env'});

export class CredsConfiguration {
    public static US_HOST = process.env.US_HOST || 'localhost';
    public static US_PORT = process.env.US_PORT || '3001';
    public static PY_HOST = process.env.PY_HOST || 'localhost';
    public static PY_PORT = process.env.PY_PORT || '3002';
}