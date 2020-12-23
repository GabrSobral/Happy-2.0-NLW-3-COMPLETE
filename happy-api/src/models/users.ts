import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from "bcrypt";
  
@Entity('user')
@Unique(['username'])
  export default class User {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Column()
    username: string;

    @Column()
    name: string;
  
    @Column()
    password: string;

    @Column()
    role: string;

    @Column({nullable: true})
    passwordResetToken: string;

    @Column({nullable: true})
    passwordResetExpires: Date;
   
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  
    hashPassword() {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compare(unencryptedPassword, this.password);
    }
}
