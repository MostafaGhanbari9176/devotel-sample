import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as process from "node:process";

const appPort = process.env.PORT || 3003;

function initSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle("MostafaGhanbari-Sample, documentation")
    .setDescription("in case of any confusion feel free for asking `+989157474087`")
    .setVersion("1")
    .addBearerAuth({ type: 'http', description: "insert the access token", scheme: "bearer", bearerFormat: "JWT" }, "access_token")
    .addServer(`http://127.0.0.1:${appPort}`, "local server")
    .build()

  const documentation = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("/docs", app, documentation, {
    customSiteTitle:"MostafaGhanbari-Sample"
  });

}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  initSwagger(app)
  
  await app.listen(appPort, () => {
    console.log(`server run on port ${appPort}, docs url: ~/docs`)
  });
}
bootstrap();
