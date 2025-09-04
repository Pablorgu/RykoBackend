import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('password_resets')
@Index(['email', 'used'])
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  codeHash: string;

  @Column({ type: 'bigint' })
  expiresAtMs: string;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'boolean', default: false })
  used: boolean;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @CreateDateColumn()
  createdAt: Date;
}
