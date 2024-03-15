import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [
    { provide: APP_GUARD, useClass: AtGuard },
    SearchService
  ],
  controllers: [SearchController]
})
export class AppModule {}
