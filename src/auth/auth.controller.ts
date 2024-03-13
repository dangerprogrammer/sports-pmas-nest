import { Body, Controller, Delete, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';
import { AcceptedGuard, RoleGuard, RtGuard, AlunoGuard } from 'src/common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';
import { LocalDto } from './dto/local.dto';
import { ModalidadeDto } from './dto/modalidade.dto';
import { AcceptDto } from './dto/accept.dto';
import { UpdateLocalDto, UpdateModalidadeDto } from './dto/updates.dto';
import { InscricaoDto } from './dto/inscricao.dto';

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

    @UseGuards(AlunoGuard)
    @Patch('aluno/inscricao')
    @HttpCode(HttpStatus.OK)
    subscribeUser(@Body() dto: InscricaoDto[], @Req() req: Request) {
        return this.authService.subscribeUser(dto, req);
    }

    @UseGuards(RoleGuard)
    @Post('create/local')
    @HttpCode(HttpStatus.CREATED)
    createLocal(@Body() dto: LocalDto) {
        return this.authService.createLocal(dto);
    }

    @UseGuards(RoleGuard)
    @Patch('update/local')
    @HttpCode(HttpStatus.CREATED)
    updateLocal(@Body() dto: UpdateLocalDto) {
        return this.authService.updateLocal(dto);
    }

    @UseGuards(RoleGuard)
    @Delete('delete/local')
    @HttpCode(HttpStatus.ACCEPTED)
    deleteLocal(@Body() dto: LocalDto) {
        return this.authService.deleteLocal(dto);
    }

    @UseGuards(RoleGuard)
    @Post('create/modalidade')
    @HttpCode(HttpStatus.CREATED)
    createModalidade(@Body() dto: ModalidadeDto) {
        return this.authService.createModalidade(dto);
    }

    @UseGuards(RoleGuard)
    @Patch('update/modalidade')
    @HttpCode(HttpStatus.CREATED)
    updateModalidade(@Body() dto: UpdateModalidadeDto) {
        return this.authService.updateModalidade(dto);
    }

    @UseGuards(RoleGuard)
    @Delete('delete/modalidade')
    @HttpCode(HttpStatus.ACCEPTED)
    deleteModalidade(@Body() dto: ModalidadeDto) {
        return this.authService.deleteModalidade(dto);
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