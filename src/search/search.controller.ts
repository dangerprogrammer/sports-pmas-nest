import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from 'src/common/decorators';

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
}
