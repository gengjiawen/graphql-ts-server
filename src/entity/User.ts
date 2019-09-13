import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column('varchar', { length: 255 })
  email: string

  @Field()
  @Column('text')
  password: string

  @Field()
  @Column('boolean', { default: false })
  confirmed: boolean

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }
}
