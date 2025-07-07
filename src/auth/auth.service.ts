import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseUser } from 'src/user/baseUser.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterLocalDto } from './dto/registerLocal.dto';
import { UserService } from 'src/user/user.service';
import { UserType } from 'src/user/userType.enum';
import { GoogleLoginDto } from './dto/registerGoogle.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @InjectRepository(BaseUser)
    private repo: Repository<BaseUser>,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterLocalDto): Promise<{ access_token: string }> {
    const exist = await this.userService.findOneByEmail(dto.email);
    if (exist) throw new ConflictException('User already exists');

    dto.username = dto.email.split('@')[0];
    const hash = await bcrypt.hash(dto.password, 12);
    const user = this.repo.create({
      ...dto,
      password: hash,
      type: UserType.USER,
    });
    await this.repo.save(user);

    const token = this.tokenFor(user);
    return { access_token: token };
  }

  async validateLocal(email: string, pass: string) {
    const u = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email=:email', { email })
      .getOne();
    if (!u || !u.password) return null;
    return (await bcrypt.compare(pass, u.password)) ? u : null;
  }

  async validateGoogleLogin(dto: GoogleLoginDto): Promise<BaseUser> {
    const { googleId, email, username } = dto;

    let user = await this.repo.findOne({ where: { googleId } });
    if (user) return user;

    const local = await this.repo.findOne({ where: { email } });
    if (local) {
      throw new ConflictException(
        'This email is already registered locally; please use your password.',
      );
    }

    user = await this.userService.create({
      username,
      email,
      password: undefined,
      googleId,
    });

    return user;
  }

  tokenFor(u: BaseUser) {
    return this.jwt.sign({ sub: u.id, email: u.email, type: (u as any).type });
  }

  async getUserFromToken(token: string): Promise<BaseUser> {
    try {
      const payload = this.jwt.verify(token);
      console.log('payload:', payload);
      const user = await this.repo.findOne({ where: { id: payload.sub } });
      if (!user) throw new ConflictException('User not found');
      return user;
    } catch (error) {
      throw new ConflictException('Token inválido');
    }
  }
}
