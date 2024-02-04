import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { Container, Service } from 'typedi';
import { ControllerConfigurator } from '@api-modules/configurators';

import { AuthService, IResponseMessage } from 'services/index';
import { IUserDto } from 'types/interfaces';

@Service()
class AuthController {
    constructor(private readonly authService: AuthService) {}

    async signUp(req: Request): Promise<IUserDto> {
        return this.authService.signUp(req);
    }

    async signIn(req: Request, res: Response, next: NextFunction): Promise<IUserDto> {
        return this.authService.signIn(req, res, next);
    }

    async googleAuth(req: Request, res: Response, next: NextFunction): Promise<any> {
        return passport.authenticate('google')(req, res, next);
    }

    async googleCallback(req: Request, res: Response, next: NextFunction): Promise<IUserDto> {
        return this.authService.googleCallback(req, res, next);
    }

    async signOut(req: Request, res: Response): Promise<IResponseMessage> {
        return this.authService.signOut(req, res);
    }
}

export const authController = ControllerConfigurator.configure<AuthController>(
    Container.get(AuthController),
);
