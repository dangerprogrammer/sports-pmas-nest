import { Body, Controller, Get, Headers, Param, Post, Req } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from 'src/common/decorators';
import { $Enums, Inscricao } from '@prisma/client';

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
    @Get('user/id/:id')
    findUserById(@Param('id') id: number) {
        return this.search.findUserById(id);
    }

    @Public()
    @Post('solic/:id')
    findSolic(@Body() dto: { limits: { min: number, max: number }, done: boolean }, @Param('id') id: number) {
        return this.search.findSolic(+id, dto);
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
    searchHorarios(@Param('modName') modName: $Enums.Aula) {
        return this.search.searchHorarios(modName);
    }

    @Public()
    @Post('horarios-subscribe/:modName')
    searchHorariosSubscribe(@Body() inscricoes: Inscricao[], @Param('modName') modName: $Enums.Aula) {
        return this.search.searchHorariosSubscribe(modName, inscricoes);
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
