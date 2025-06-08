import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() // This decorator marks the route as publicly accessible (no JWT required)
  @HttpCode(HttpStatus.OK) // Ensures a 200 OK status on success
  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    // The authService.signIn method will handle authentication and return a JWT
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  @Public() // This decorator also marks the registration route as publicly accessible.
  @HttpCode(HttpStatus.CREATED) // Sets the HTTP status code to 201 Created for a successful registration.
  @Post('register') // Handles POST requests to '/auth/register'
  async register(@Body() registerDto: RegisterDto) {
    // Calls the register method from AuthService, passing the name, email, and password from the request body.
    return this.authService.register(
      registerDto.name,
      registerDto.email,
      registerDto.password,
    );
  }
}
