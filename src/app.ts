import Plumier, { WebApiFacility } from "plumier";
import Koa from "koa"

export function createApp(): Promise<Koa> {
    return new Plumier()
        .set(new WebApiFacility())
        .initialize()
}
