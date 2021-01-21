import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { authorize, bind, HttpStatusError, response, route } from "plumier"
import { getManager } from "typeorm"

import { LoginUser } from "../_shared/login-user"
import { User } from "../user/user-entity"

export class AuthController {
    readonly userRepo = getManager().getRepository(User)

    // --------------------------------------------------------------------- //
    // --------------------------- TOKEN HELPERS --------------------------- //
    // --------------------------------------------------------------------- //

    @route.ignore()
    private jwtClaims(user: User, refresh?: true) {
        return <LoginUser>{ userId: user.id, role: user.role, refresh }
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
        const user = await this.userRepo.findOne({ email })
        if (!user || !await compare(password, user.password))
            throw new HttpStatusError(422, "Invalid username or password")
        const tokens = this.createJwtTokens(user)
        return response.json(tokens)
            // cookie token, http-only, same-site: lax
            .setCookie("Authorization", this.createCookieToken(user), { sameSite: "lax" })
    }

    @route.post()
    @authorize.route("RefreshToken")
    async refresh(@bind.user() user: LoginUser) {
        const saved = await this.userRepo.findOne(user.userId);
        if (!saved) throw new HttpStatusError(404, "User not found");
        return this.createJwtTokens(saved);
    }

    async logout() {
        // clear cookie
        return response.json({}).setCookie("Authorization")
    }
}