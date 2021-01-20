import { JwtAuthFacility } from "@plumier/jwt"
import { SwaggerFacility } from "@plumier/swagger"
import { TypeORMFacility } from "@plumier/typeorm"
import Plumier, { Configuration, ControllerFacility, LoggerFacility, WebApiFacility } from "plumier"

function createApp(config?: Partial<Configuration>) {
    return new Plumier()
        .set({ ...config, rootDir: __dirname })
        .set(new WebApiFacility())
        .set(new TypeORMFacility())
        .set(new JwtAuthFacility())
        .set(new SwaggerFacility())
        .set(new ControllerFacility({ 
            controller: "./api/**/*-*(entity|controller).*(ts|js)" 
        }))
        .set(new LoggerFacility())
        .initialize()
}

export default createApp