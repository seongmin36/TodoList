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
  users_id: number;

  @Column({ length: 30 })
  name: string;

  @Column({ type: 'text', nullable: true })
  profile_img: string | null;

  @Column({ default: false })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => AuthAccount, (auth) => auth.user)
  auth_accounts: AuthAccount[];

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
