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
    private createToken(user: User, option?: { expiresIn?: string, refresh?: true }) {
        const dOption = { expiresIn: '9999 year' }
        const { refresh, expiresIn } = { ...dOption, ...option } ?? dOption
        return sign(<JwtClaims>{ userId: user.id, role: user.role, refresh }, process.env.PLUM_JWT_SECRET!, { expiresIn })
    }

    @route.ignore()
    private createTokens(user: User) {
        return {
            // login token, expire every 30 minutes
            token: this.createToken(user, { expiresIn: "30m" }),
            // refresh token, never expires
            refreshToken: this.createToken(user, { refresh: true })
        };
    }

    // --------------------------------------------------------------------- //
    // -------------------------------- APIs ------------------------------- //
    // --------------------------------------------------------------------- //

    @authorize.route("Public")
    @route.post()
    async login(email: string, password: string) {
        const UserModel = model(User)
        const user = await UserModel.findOne({ email, status: "Active" })
        if (!user || !await compare(password, user.password))
            throw new HttpStatusError(422, "Invalid username or password")
        const tokens = this.createTokens(user)
        return response.json(tokens)
            // cookie token, http-only, same-site: lax
            .setCookie("Authorization", this.createToken(user), { sameSite: "lax" })
    }

    @route.post()
    @authorize.route("RefreshToken")
    async refresh(@bind.user() user: JwtClaims) {
        const UserModel = model(User)
        const saved = await UserModel.findById(user.userId);
        if (!saved) throw new HttpStatusError(404, "User not found");
        if (saved.status === "Suspended") throw new HttpStatusError(404, "User not found");
        return this.createTokens(saved);
    }

    @route.post()
    async logout() {
        // clear cookie
        return response.json({}).setCookie("Authorization")
    }
}