import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';

export enum AuthProvider {
  GOOGLE = 'google',
  GENERAL = 'general',
  MIXED = 'mixed', // 통합 로그인
}

@Entity({ name: 'auth_accounts' })
@Unique(['auth_provider', 'provider_user_id'])
export class AuthAccount {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  auth_accounts_id: number;

  @ManyToOne(() => User, { nullable: false, eager: true })
  user: User;

  @Column({ type: 'enum', enum: AuthProvider })
  auth_provider: AuthProvider;

  @Column({ length: 255 })
  provider_user_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
