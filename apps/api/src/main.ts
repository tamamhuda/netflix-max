import { NestFactory } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { APP_CONFIG } from "@netflix-max/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix(APP_CONFIG.API_PREFIX);

  // CORS
  app.enableCors({
    origin: APP_CONFIG.CORS_ORIGIN,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ZodValidationPipe());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Netflix Max API")
    .setDescription("Netflix Max Streaming Platform API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(
    `🚀 API running on: http://localhost:${port}${APP_CONFIG.API_PREFIX}`
  );
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
