import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  task!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User)
  user!: User;
}
