import {config} from "dotenv";

// config({path : '/.env'}); // if there only one env file
config({path: `.env.${process.env.NODE_ENV || 'development'}.local`}); // if there exist more than one env file
export const {PORT , NODE_ENV } = process.env;