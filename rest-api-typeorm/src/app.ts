import { JwtAuthFacility } from "@plumier/jwt"
import { SwaggerFacility } from "@plumier/swagger"
import { TypeORMFacility } from "@plumier/typeorm"
import Plumier, { Configuration, LoggerFacility, WebApiFacility } from "plumier"


function createApp(config?: Partial<Configuration>) {
    return new Plumier()
        .set({ ...config })
        .set(new WebApiFacility())
        .set(new TypeORMFacility())
        .set(new JwtAuthFacility({ 
            global: "Private",
        }))
        .set(new SwaggerFacility())
        .set(new LoggerFacility())
        .initialize()
}

export default createApp