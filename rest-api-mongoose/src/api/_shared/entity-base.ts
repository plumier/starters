import { authorize, entity } from "plumier"
import { collection } from "@plumier/mongoose"

@collection({
    timestamps: true, 
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false }
})
export class EntityBase {
    @collection.id()
    id: string

    @authorize.readonly()
    createdAt: Date

    @authorize.readonly()
    updatedAt: Date

    @entity.deleteColumn()
    @collection.property({ default: false })
    deleted: boolean
}