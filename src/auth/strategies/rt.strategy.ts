import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'at-secret',
            passReqToCallback: !0
        })
    }

    validate(req: Request, payload: any) {
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();

        return { ...payload, refreshToken };
    }
}