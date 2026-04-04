import { TodoTag } from '@/todo-tags/entities/todo-tag.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  tags_id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 7, nullable: true })
  color: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => TodoTag, (todoTag) => todoTag.tag)
  todo_tags: TodoTag[];
}
