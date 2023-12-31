
import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import * as argon2 from "argon2";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {EnumAuthProvider, User} from "@prisma/client";
import {GoogleSignInDto} from "./dto/google-sign-in.dto";

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) {}

    async register(dataDto: RegisterDto):
        Promise<{ success: boolean, message: string, data?: any }>
    {
        try {
            const userWithEmail = await this.prisma.user.findUnique({
                where: {email: dataDto.email}
            });
            if (userWithEmail) {
                return {success: false, message: "Email taken!"};
            }

            const userWithUsername = await this.prisma.user.findUnique({
                where: {username: dataDto.username},
            });
            if (userWithUsername) {
                return {success: false, message: "Username taken!"};
            }

            const hashedPassword = await argon2.hash(dataDto.password);

            const user = await this.prisma.user.create({
                data: {
                    auth_provider: EnumAuthProvider.EMAIL,
                    name: dataDto.name,
                    username: dataDto.username,
                    email: dataDto.email,
                    hash: hashedPassword,
                    birth_date: dataDto.birth_date,
                    gender: dataDto.gender,
                },
                select: {id: true, email: true, name: true, username: true, createdAt: true}
            });

            return {success: true, message: "User created successfully."};
        } catch (err) {
            const message = (err.response && err.response.data.message) || err.message || err.toString();
            return {success: false, message};
        }
    }

    async login(dataDto: LoginDto):
        Promise<{ success: boolean, message: string, data?: any }>
    {
        try {
            const user = await this.prisma.user.findUnique({
                where: {email: dataDto.email},
                select: {
                    id: true, createdAt: true, hash: true, avatar: true,
                    email: true, name: true, username: true, birth_date: true, gender: true,
                },
            });

            if (!user) {
                return {success: false, message: "User not found!"};
            }

            const match = await argon2.verify(user.hash, dataDto.password);

            if (!match) {
                return {success: false, message: "Invalid password!"};
            }

            const token = await this.jwtSign(user.id, user.email);

            return {
                success: true,
                message: "User logged in successfully.",
                data: {
                    id: user.id, createdAt: user.createdAt, access_token: token, avatar: user.avatar,
                    name: user.name, email: user.email, username: user.username, birth_date: user.birth_date, gender: user.gender,
                },
            };
        } catch (err) {
            const message = (err.response && err.response.data.message) || err.message || err.toString();
            return {success: false, message};
        }
    }

    async googleSignIn(dataDto: GoogleSignInDto):
        Promise<{ success: boolean, message: string, data?: any }>
    {
        try {
            const {OAuth2Client} = require('google-auth-library');
            const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: dataDto.idToken,
                audience: [process.env.GOOGLE_WEB_CLIENT_ID],
            });
            const payload = ticket.getPayload();

            let user = await this.prisma.user.findUnique({
                where: {email: payload.email},
                select: {
                    createdAt: true,
                    id: true, name: true, email: true, username: true,
                    birth_date: true, gender: true, avatar: true,
                }
            });

            if (user) {
                if (user.email !== payload.email) {
                    return {
                        success: true,
                        message: "Email mismatch!",
                    };
                }
            } else {
                if (!payload.email_verified) {
                    return {
                        success: false,
                        message: "Email not verified by Google!",
                    };
                }

                // TODO: check if username is taken
                const randomNum = Math.floor(1000 + Math.random() * (9999 - 1000 + 1));
                const usernameNonFiltered = `${payload.given_name}${payload.family_name}${randomNum}`;
                const username = usernameNonFiltered.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');

                user = await this.prisma.user.create({
                    data: {
                        auth_provider: EnumAuthProvider.GOOGLE,
                        name: payload.name,
                        email: payload.email,
                        username: username,
                        // hash: null,
                        // birth_date: null,
                        gender: 'unknown',
                        avatar: payload.picture,
                    },
                    select: {
                        createdAt: true,
                        id: true, name: true, email: true, username: true,
                        birth_date: true, gender: true, avatar: true,
                    }
                });
            }

            const token = await this.jwtSign(user.id, user.email);

            return {
                success: true,
                message: "User logged in successfully.",
                data: {
                    access_token: token,
                    ...user,
                },
            };
        } catch (err) {
            const message = (err.response && err.response.data.message) || err.message || err.toString();
            return {success: false, message};
        }
    }

    jwtSign(userId: number, email: string): Promise<string>
    {
        const payload = {
            sub: userId,
            email,
        };

        const secret = this.config.get<string>('JWT_SECRET');
        const expiresIn = this.config.get<string>('JWT_EXPIRES_IN');

        return this.jwtService.signAsync(payload, {
            secret: secret, // process.env.JWT_SECRET,
            expiresIn: expiresIn
        });
    }

    async getUserByEmail(email: string): Promise<any>
    {
        return this.prisma.user.findUnique({
            where: {email: email},
            select: {id: true, email: true, name: true, username: true, createdAt: true, verification_code: true},
        });
    }

    generateVerificationCode(): string {
        const number = Math.floor(100000 + Math.random() * 900000);
        return number.toString();
    }

    async saveVerificationCode(user: User, verification_code: string): Promise<void>
    {
        await this.prisma.user.update({
            where: {id: user.id},
            data: {verification_code},
        });
    }

    async updatePassword(id: number, password: string): Promise<void>
    {
        const hashedPassword = await argon2.hash(password);
        await this.prisma.user.update({
            where: {id},
            data: {hash: hashedPassword, verification_code: null},
        });
    }
}
