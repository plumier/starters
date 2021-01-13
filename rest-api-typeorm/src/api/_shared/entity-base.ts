import { authorize, entity } from "plumier"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"


@Entity()
export class EntityBase {
    @PrimaryGeneratedColumn()
    id: number

    @authorize.readonly()
    @CreateDateColumn()
    createdAt: Date

    @authorize.readonly()
    @UpdateDateColumn()
    updatedAt: Date

    @entity.deleteColumn()
    @Column({ default: false })
    deleted: boolean
}