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
  MIXED = 'mixed',
}

@Entity({ name: 'auth_accounts' })
@Unique(['authProvider', 'providerUserId'])
export class AuthAccount {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'auth_accounts_id' })
  id: number;

  @ManyToOne(() => User, { nullable: false, eager: true })
  user: User;

  @Column({ name: 'auth_provider', type: 'enum', enum: AuthProvider })
  authProvider: AuthProvider;

  @Column({ name: 'provider_user_id', length: 255 })
  providerUserId: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @MinLength(8)
  passwordHash: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
