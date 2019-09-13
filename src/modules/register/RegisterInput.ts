import { ArgsType, Field } from 'type-graphql'
import { IsEmail, Length } from 'class-validator'

@ArgsType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @Length(3, 25)
  password: string
}
