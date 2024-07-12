import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configServise = app.get(ConfigService);
  const SERVER_PORT = configServise.get("SERVER_PORT");
  const CLIENT_URL = configServise.get("CLIENT_URL");
  const NODE_APP_INSTANSE = configServise.get("NODE_APP_INSTANCE");

  app.use(cookieParser());
  app.enableCors({
    origin: [CLIENT_URL],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors();

  const port = NODE_APP_INSTANSE ? `300${NODE_APP_INSTANSE}` : SERVER_PORT;
  await app.listen(port);
}
bootstrap();
