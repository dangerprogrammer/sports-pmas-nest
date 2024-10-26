import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from 'src/common/decorators';
import { $Enums, Inscricao, Role } from '@prisma/client';

@Controller('search')
export class SearchController {
    constructor(
        private search: SearchService
    ) { }

    @Public()
    @Get('user/:cpf')
    findUser(@Param('cpf') cpf: string) {
        return this.search.findUser(cpf);
    }

    @Public()
    @Get('modalidade/:mod')
    findMod(@Param('mod') mod: string) {
        return this.search.findMod(mod);
    }

    @Public()
    @Get('user/id/:id')
    findUserById(@Param('id') id: number) {
        return this.search.findUserById(id);
    }

    @Public()
    @Get('aluno/id/:id')
    findAlunoById(@Param('id') id: number) {
        return this.search.findAlunoById(id);
    }

    @Public()
    @Post('solic/:id')
    findSolic(@Body() dto: { limits: { min: number, max: number }, done: boolean }, @Param('id') id: number) {
        return this.search.findSolic(+id, dto);
    }

    @Public()
    @Post('users')
    findUsersRole(@Body() dto: { role: Role, limits: { min: number, max: number } }) {
        return this.search.findUsersRole(dto);
    }

    @Public()
    @Get('inscricao/:id')
    findInscricoes(@Param('id') id: number) {
        return this.search.findInscricoes(+id);
    }

    @Public()
    @Get('modalidades')
    searchModalidades() {
        return this.search.searchModalidades();
    }

    @Public()
    @Get('horarios/:modName')
    searchHorarios(@Param('modName') modName: string) {
        return this.search.searchHorarios(modName);
    }

    @Public()
    @Get('users/:time')
    findUsersHorario(@Param('time') time: Date) {
        return this.search.findUsersHorario(time);
    }

    @Public()
    @Post('horarios-subscribe/:modName')
    searchHorariosSubscribe(@Body() inscricoes: Inscricao[], @Param('modName') modName: string) {
        return this.search.searchHorariosSubscribe(modName, inscricoes);
    }

    @Public()
    @Get('horario/:id')
    searchHorario(@Param('id') id: number) {
        return this.search.searchHorario(+id);
    }

    @Get('solic/:id')
    searchSolic(@Param('id') id: number) {
        return this.search.searchSolic(+id);
    }

    @Public()
    @Get('token')
    findUserByToken(@Headers('authorization') auth: string) {
        return this.search.findUserByToken(auth);
    }
}
