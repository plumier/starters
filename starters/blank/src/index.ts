import Plumier, { WebApiFacility } from "plumier";
import dotenv from "dotenv"

dotenv.config()

new Plumier()
    .set(new WebApiFacility())
    .listen(process.env.PORT ?? 8000)