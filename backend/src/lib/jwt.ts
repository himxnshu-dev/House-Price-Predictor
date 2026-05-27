import jwt, { SignOptions } from "jsonwebtoken";

interface JwtPayload {
    userId: string;
    tokenVersion: number;
}

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
        throw new Error("JWT secret is not defined in environment variables");
    }
    return secret;
}

const signJwt = (
    payload: JwtPayload,
    expiresIn: NonNullable<SignOptions["expiresIn"]>
): string => {
    return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

export const verifyJwt = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, getJwtSecret()) as JwtPayload;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
}

export const generateAccessToken = (
    payload: JwtPayload
): string => {
    const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>;
    return signJwt(payload, expiresIn);
}

export const generateRefreshToken = (
    payload: JwtPayload
): string => {
    const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>
    return signJwt(payload, expiresIn)
}