import { Controller, Get, Headers, Param, Req } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from 'src/common/decorators';
import { $Enums } from '@prisma/client';

@Controller('search')
export class SearchController {
    constructor (
        private search: SearchService
    ) {}

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
    @Get('admin/:id')
    findAdmin(@Param('id') id: number) {
        return this.search.findAdmin(+id);
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
