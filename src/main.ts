import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilita el ValidationPipe globalmente
  // Esto hará que todos los DTOs que uses en tus controladores
  // sean validados automáticamente según los decoradores de class-validator.
  app.useGlobalPipes(
    new ValidationPipe({
      // Permite que solo las propiedades definidas en el DTO pasen.
      // Cualquier otra propiedad en el cuerpo de la solicitud será eliminada.
      whitelist: true,
      // Si se envía alguna propiedad que no está definida en el DTO,
      // se lanzará un error. Esto es útil para evitar enviar datos no deseados.
      forbidNonWhitelisted: true,
      // Habilita la transformación automática del cuerpo de la solicitud
      // a una instancia del DTO. Esto es crucial para que los decoradores
      // como @IsEmail y otros funcionen correctamente.
      transform: true,
      // Opcional: Si quieres mensajes de error más detallados de las validaciones,
      // puedes deshabilitar esta opción para e``l desarrollo.
      // Siempre es mejor dejarla en true para producción por seguridad.
      disableErrorMessages: false,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
