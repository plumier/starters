import { JwtAuthFacility } from "@plumier/jwt"
import { SwaggerFacility } from "@plumier/swagger"
import { MongooseFacility } from "@plumier/mongoose"
import Plumier, { authorize, Configuration, ControllerFacility, LoggerFacility, WebApiFacility } from "plumier"


function createApp(config?: Partial<Configuration>) {
    return new Plumier()
        .set({ ...config, rootDir: __dirname })
        .set(new WebApiFacility())
        .set(new MongooseFacility())
        .set(new JwtAuthFacility({ 
            global: authorize.route("Private"),
            authPolicies: "./api/**/*-policy.*(ts|js)"
        }))
        .set(new SwaggerFacility())
        .set(new ControllerFacility({
            controller: "./api/**/*-*(entity|controller).*(ts|js)"
        }))
        .set(new LoggerFacility())
        .initialize()
}

export default createApp