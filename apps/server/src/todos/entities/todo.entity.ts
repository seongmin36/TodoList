import { User } from '@/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  todos_id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ default: false })
  is_completed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  due_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date | null;

  @Column({ type: 'enum', enum: RecurrenceType, default: RecurrenceType.NONE })
  recurrence_type: RecurrenceType;

  @Column({ type: 'timestamp', nullable: true })
  recurrence_start_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  recurrence_end_at: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => TodoTag, (todoTag) => todoTag.todo)
  todo_tags: TodoTag[];
}
