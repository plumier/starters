import Plumier, { WebApiFacility , PlumierConfiguration, Configuration} from "plumier";
import Koa from "koa"

export function createApp(app?:Partial<Configuration>): Promise<Koa> {
    return new Plumier()
        .set(app || {})
        .set(new WebApiFacility())
        .initialize()
}
