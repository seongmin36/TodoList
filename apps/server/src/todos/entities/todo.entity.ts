import { TodoTag } from '@/todo-tags/entities/todo-tag.entity';
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
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'todos_id' })
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_completed', default: false })
  isDone: boolean;

  @Column({ name: 'due_at', type: 'timestamp', nullable: true })
  dueAt: Date | null;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({
    name: 'recurrence_type',
    type: 'enum',
    enum: RecurrenceType,
    default: RecurrenceType.NONE,
  })
  recurrenceType: RecurrenceType;

  @Column({ name: 'recurrence_start_at', type: 'timestamp', nullable: true })
  recurrenceStartAt: Date | null;

  @Column({ name: 'recurrence_end_at', type: 'timestamp', nullable: true })
  recurrenceEndAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => TodoTag, (todoTag) => todoTag.todo)
  todoTags: TodoTag[];
}
