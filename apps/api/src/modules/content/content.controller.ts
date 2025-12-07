import { Controller, Get, Query, Param, UseGuards, Req } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { ContentService } from "./content.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UsersService } from "../users/users.service";
import {
  ContentQueryDto,
  HomeContentResponseDto,
  SearchResponseDto,
  ContentItemDto,
  ErrorResponseDto,
} from "./dto/content.dto";

@ApiTags("Content")
@Controller("content")
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly usersService: UsersService
  ) {}

  @Get("home")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get home page content",
    description:
      "Returns trending, Netflix originals, and Max content (HBO, DC, WB) if user has Max subscription",
  })
  @ApiResponse({
    status: 200,
    description: "Home page content retrieved successfully",
    type: HomeContentResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - JWT token required",
    type: ErrorResponseDto,
  })
  async getHomeContent(@Req() req) {
    const user = await this.usersService.findById(req.user.id);
    const hasMaxAccess = user.subscription === "max";
    return this.contentService.getHomeContent(hasMaxAccess);
  }

  @Get("trending")
  @ApiOperation({
    summary: "Get public trending content",
    description:
      "Returns trending Netflix and Max content for the public landing page. No authentication required.",
  })
  @ApiResponse({
    status: 200,
    description: "Public trending content",
  })
  async getPublicTrending() {
    return this.contentService.getPublicTrending();
  }

  @Get("search")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Search content",
    description: "Search movies and TV shows by query",
  })
  @ApiQuery({ name: "search", required: false, description: "Search query" })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (default: 1)",
  })
  @ApiResponse({
    status: 200,
    description: "Search results",
    type: SearchResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: ErrorResponseDto,
  })
  async searchContent(@Query() query: ContentQueryDto) {
    return this.contentService.searchContent(
      query.search || "",
      query.page || 1
    );
  }

  @Get(":mediaType/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get content details",
    description: "Get detailed information about a movie or TV show",
  })
  @ApiParam({
    name: "mediaType",
    enum: ["movie", "tv"],
    description: "Content type",
  })
  @ApiParam({ name: "id", description: "TMDB content ID" })
  @ApiResponse({
    status: 200,
    description: "Content details",
    type: ContentItemDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Content not found",
    type: ErrorResponseDto,
  })
  async getDetails(
    @Param("mediaType") mediaType: "movie" | "tv",
    @Param("id") id: number
  ) {
    return this.contentService.getDetails(id, mediaType);
  }
}
