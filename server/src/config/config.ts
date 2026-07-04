import dotenv from "dotenv";

dotenv.config();
export const appConfig = {
    PORT: process.env.PORT || 8080,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    ACCESS_TOKEN_AGE: '7d',
    EVIRONMENT: process.env.ENVIRONMENT
}

export default appConfig;