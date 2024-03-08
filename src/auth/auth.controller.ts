import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';
import { RoleGuard, RtGuard } from 'src/common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';
import { LocalDto } from './dto/local.dto';
import { ModalidadeDto } from './dto/modalidade.dto';
import { AcceptDto } from './dto/accept.dto';
import { AcceptedGuard } from 'src/common/guards/accepted.guard';

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {}

    @Public()
    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signupLocal(dto);
    }

    @Public()
    @UseGuards(AcceptedGuard)
    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signinLocal(dto);
    }

    @UseGuards(RoleGuard)
    @Post('create/local')
    @HttpCode(HttpStatus.CREATED)
    createLocal(@Body() dto: LocalDto) {
        return this.authService.createLocal(dto);
    }

    @UseGuards(RoleGuard)
    @Post('create/modalidade')
    @HttpCode(HttpStatus.CREATED)
    createModalidade(@Body() dto: ModalidadeDto) {
        return this.authService.createModalidade(dto);
    }

    @UseGuards(RoleGuard)
    @Post('user')
    @HttpCode(HttpStatus.ACCEPTED)
    acceptUser(@Body() dto: AcceptDto) {
        return this.authService.acceptUser(dto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: number) {
        return this.authService.logout(userId);
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUserId() userId: number, @GetCurrentUser('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(userId, refreshToken);
    }
}