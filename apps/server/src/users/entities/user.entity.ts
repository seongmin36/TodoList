import { AuthAccount } from '@/auth-accounts/entities/auth-account.entity';
import { Todo } from '@/todos/entities/todo.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  userId: number;

  @Column({ length: 30 })
  name: string;

  @Column({ name: 'profile_img', type: 'text', nullable: true })
  profileImage: string | null;

  // 가입 직후에는 활성상태 = true
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => AuthAccount, (auth) => auth.user)
  authAccounts: AuthAccount[];

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
