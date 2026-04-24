import { Tag } from '@/tags/entities/tag.entity';
import { Todo } from '@/todos/entities/todo.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['todo', 'tag'])
export class TodoTag {
  @PrimaryGeneratedColumn({ name: 'todo_tag_id' })
  id: number;

  @ManyToOne(() => Todo)
  todo: Todo;

  @ManyToOne(() => Tag, (tag) => tag.todoTags)
  tag: Tag;
}
