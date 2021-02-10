import { JwtAuthFacility } from "@plumier/jwt"
import { MongooseFacility } from "@plumier/mongoose"
import { SwaggerFacility } from "@plumier/swagger"
import Plumier, { Configuration, LoggerFacility, WebApiFacility } from "plumier"


function createApp(config?: Partial<Configuration>) {
    return new Plumier()
        .set({ ...config, rootDir: __dirname })
        .set(new WebApiFacility())
        .set(new MongooseFacility())
        .set(new JwtAuthFacility({
            global: "Private"
        }))
        .set(new SwaggerFacility())
        .set(new LoggerFacility())
        .initialize()
}

export default createApp