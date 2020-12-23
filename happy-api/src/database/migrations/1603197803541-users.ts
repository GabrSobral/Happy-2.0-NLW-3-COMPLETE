import { MigrationInterface, QueryRunner, Table} from "typeorm";


export class users1603197803541 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable( new Table({
            name: 'user',
            columns: [
            {
                name: 'id',
                type: 'integer',
                unsigned: true,
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',     
            },
            {
                name: 'name',
                type: 'varchar'
            },
            {
                name:'username',
                type:'varchar', 
            },
            {
                name:'role',
                type:'varchar',
            },
            {
                name: 'password',
                type: 'varchar',
            },
            {
                name: 'passwordResetToken',
                type: 'varchar',
                isNullable: true,
            },
            {
                name: 'passwordResetExpires',
                type: 'date',
                isNullable: true,
            },
            {
                name: 'createdAt',
                type: 'date',
            },
            {
                name: 'updatedAt',
                type: 'date',
            }
        ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
