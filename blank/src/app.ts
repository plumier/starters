import Plumier, { Configuration, WebApiFacility } from "plumier";
import dotenv from "dotenv"

dotenv.config()

function createApp(config?: Partial<Configuration>) {
    return new Plumier()
        .set({ ...config, rootDir: __dirname })
        .set(new WebApiFacility())
        .initialize()
}

export default createApp