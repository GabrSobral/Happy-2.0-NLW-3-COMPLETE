import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import User from "../../models/users";

export class CreateAdminUser1603712744756 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let user = new User();
        user.username = "admin";
        user.name = "nameAdmin"
        user.password = "admin";
        user.role = "admin";
        user.hashPassword();
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
