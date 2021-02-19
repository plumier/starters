import dotenv from "dotenv"

import createApp from "./app"

dotenv.config()

createApp()
    .then(koa => koa.listen(process.env.PORT ?? 8000))
    .catch(err => console.error(err))


import Cors from "@koa/cors"
import BodyParser from "koa-bodyparser"
import { DefaultFacility, PlumierApplication } from "plumier"

export class WebApiFacility extends DefaultFacility {
    async setup({ koa }: Readonly<PlumierApplication>) {
        //do something with the Koa instance
        koa.use(<koa middleware>)
    }