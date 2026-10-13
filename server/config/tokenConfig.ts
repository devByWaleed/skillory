import "dotenv/config";

export const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10);   // minutes
export const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "7", 10); // days