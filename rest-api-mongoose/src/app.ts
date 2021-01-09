import { JwtAuthFacility } from "@plumier/jwt"
import { SwaggerFacility } from "@plumier/swagger"
import { MongooseFacility } from "@plumier/mongoose"
import Plumier, { Configuration, ControllerFacility, WebApiFacility } from "plumier"

function createApp(config?: Partial<Configuration>) {
    return new Plumier()
        .set({ ...config, rootDir: __dirname })
        .set(new WebApiFacility())
        .set(new MongooseFacility())
        .set(new JwtAuthFacility())
        .set(new SwaggerFacility())
        .set(new ControllerFacility({ 
            controller: "./api/**/*-*(entity|controller).*(ts|js)" 
        }))
        .initialize()
}

export default createApp