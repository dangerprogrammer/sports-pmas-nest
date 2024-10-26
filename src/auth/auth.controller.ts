import { Body, Controller, Delete, Headers, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto/auth.dto';
import { RoleGuard, RtGuard, AlunoGuard } from 'src/common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';
import { LocalDto } from './dto/local.dto';
import { ModalidadeDto } from './dto/modalidade.dto';
import { AcceptDto } from './dto/accept.dto';
import { UpdateLocalDto, UpdateModalidadeDto, UpdateSolicDto, UpdateUserDto } from './dto/updates.dto';
import { InscricaoDto } from './dto/inscricao.dto';
import { SolicDto } from './dto/solic.dto';

@Controller('auth')
export class AuthController {
    constructor (private auth: AuthService) {}

    @Public()
    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto: SignupDto) {
        return this.auth.signupLocal(dto);
    }

    @Public()
    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto: SigninDto) {
        return this.auth.signinLocal(dto);
    }

    @UseGuards(AlunoGuard)
    @Patch('aluno/inscricao')
    @HttpCode(HttpStatus.OK)
    subscribeUser(@Body() dto: InscricaoDto[], @Req() req: Request) {
        return this.auth.subscribeUser(dto, req);
    }

    @UseGuards(RoleGuard)
    @Post('create/local')
    @HttpCode(HttpStatus.CREATED)
    createLocal(@Body() dto: LocalDto) {
        return this.auth.createLocal(dto);
    }

    @UseGuards(RoleGuard)
    @Delete('delete/local')
    @HttpCode(HttpStatus.ACCEPTED)
    deleteLocal(@Body() dto: LocalDto) {
        return this.auth.deleteLocal(dto);
    }

    @UseGuards(RoleGuard)
    @Post('create/modalidade')
    @HttpCode(HttpStatus.CREATED)
    createModalidade(@Body() dto: ModalidadeDto) {
        return this.auth.createModalidade(dto);
    }

    @UseGuards(RoleGuard)
    @Patch('update/modalidade')
    @HttpCode(HttpStatus.CREATED)
    updateModalidade(@Body() dto: UpdateModalidadeDto) {
        return this.auth.updateModalidade(dto);
    }

    @UseGuards(RoleGuard)
    @Post('delete/modalidade')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteModalidade(@Body() dto: ModalidadeDto) {
        return this.auth.deleteModalidade(dto);
    }

    @UseGuards(RoleGuard)
    @Post('user')
    @HttpCode(HttpStatus.ACCEPTED)
    acceptUser(@Headers('authorization') auth: string, @Body() dto: AcceptDto) {
        return this.auth.acceptUser(auth, dto);
    }

    @Patch('update/user')
    @HttpCode(HttpStatus.CREATED)
    updateUser(@Body() dto: UpdateUserDto) {
        return this.auth.updateUser(dto);
    }

    @Public()
    @Patch('create/solic')
    @HttpCode(HttpStatus.CREATED)
    createSolic(@Body() dto: SolicDto) {
        return this.auth.createSolic(dto);
    }

    @Public()
    @Patch('update/solic')
    @HttpCode(HttpStatus.CREATED)
    updateSolic(@Body() dto: UpdateSolicDto) {
        return this.auth.updateSolic(dto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: number) {
        return this.auth.logout(userId);
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUserId() userId: number, @GetCurrentUser('refreshToken') refreshToken: string) {
        return this.auth.refreshTokens(userId, refreshToken);
    }
}