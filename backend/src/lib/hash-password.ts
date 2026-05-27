import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
    if (!password) {
        throw new Error("Password is required for hashing");
    }
    return bcrypt.hash(password, SALT_ROUNDS);
}

export const verifyPassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    if (!password || !hashedPassword) {
        throw new Error("Both password and hashed password are required for verification");
    }
    return bcrypt.compare(password, hashedPassword);
}