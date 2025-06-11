import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0.0, nullable: false })
  balance: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.transactions_sent)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, (user) => user.received_transactions)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;
}
