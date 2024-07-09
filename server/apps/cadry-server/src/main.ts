import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors();

  const configServise = app.get(ConfigService);
  const SERVER_PORT = configServise.get("SERVER_PORT");
  const NODE_APP_INSTANSE = configServise.get("NODE_APP_INSTANCE");

  const port = NODE_APP_INSTANSE ? `300${NODE_APP_INSTANSE}` : SERVER_PORT;

  await app.listen(port);
}
bootstrap();
