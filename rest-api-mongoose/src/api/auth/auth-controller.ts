import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { authorize, bind, HttpStatusError, JwtClaims, response, route } from "plumier"

import { User } from "../user/user-entity"
import model from "@plumier/mongoose"

export class AuthController {

    // --------------------------------------------------------------------- //
    // --------------------------- TOKEN HELPERS --------------------------- //
    // --------------------------------------------------------------------- //

    @route.ignore()
    private jwtClaims(user: User, refresh?: true) {
        return <JwtClaims>{ userId: user.id, role: user.role, refresh }
    }

    @route.ignore()
    private createJwtTokens(user: User) {
        return {
            // login token, expire every 30 minutes
            token: sign(this.jwtClaims(user), process.env.PLUM_JWT_SECRET!, { expiresIn: "30m" }),
            // refresh token, never expires
            refreshToken: sign(this.jwtClaims(user, true), process.env.PLUM_JWT_SECRET!)
        };
    }

    @route.ignore()
    private createCookieToken(user: User) {
        // cookie token, never expire
        return sign(this.jwtClaims(user), process.env.PLUM_JWT_SECRET!)
    }

    // --------------------------------------------------------------------- //
    // -------------------------------- APIs ------------------------------- //
    // --------------------------------------------------------------------- //

    @authorize.route("Public")
    @route.post()
    async login(email: string, password: string) {
        const UserModel = model(User)
        const user = await UserModel.findOne({ email })
        if (!user || !await compare(password, user.password))
            throw new HttpStatusError(422, "Invalid username or password")
        const tokens = this.createJwtTokens(user)
        return response.json(tokens)
            // cookie token, http-only, same-site: lax
            .setCookie("Authorization", this.createCookieToken(user), { sameSite: "lax" })
    }

    @route.post()
    @authorize.route("RefreshToken")
    async refresh(@bind.user() user: JwtClaims) {
        const UserModel = model(User)
        const saved = await UserModel.findById(user.userId);
        if (!saved) throw new HttpStatusError(404, "User not found");
        return this.createJwtTokens(saved);
    }

    @route.post()
    async logout() {
        // clear cookie
        return response.json({}).setCookie("Authorization")
    }
}