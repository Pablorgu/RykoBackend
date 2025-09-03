import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecommendationService } from './recommendation.service';
import { RecommendationQueryDto } from './dto/recommendation-query.dto';
import {
  RecommendationDto,
  RecommendationResponseDto,
} from './dto/recommendation.dto';
import { MealTime } from 'src/meal/enums/mealTime.enum';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  /**
   * Gets dish recommendation for a specific meal
   * Protected with JWT, supports exclusions and scale parameters
   */
  @UseGuards(JwtAuthGuard)
  @Get(':date')
  @HttpCode(200)
  async getRecommendation(
    @Param('date') date: string,
    @Query() queryDto: RecommendationQueryDto,
    @Req() req: any,
  ): Promise<RecommendationResponseDto> {
    const userId = req.user.id;

    const response =
      await this.recommendationService.getRecommendationWithDiagnostics(
        userId,
        date,
        queryDto,
      );

    return response;
  }
}
