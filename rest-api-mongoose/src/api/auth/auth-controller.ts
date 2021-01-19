import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { authorize, bind, HttpStatusError, response, route } from "plumier"
import model from "@plumier/mongoose"

import { LoginUser } from "../_shared/login-user"
import { User } from "../user/user-entity"

interface SignOption {
    expiresIn: string | number,
    refreshToken: boolean
}

export class AuthController {

    @route.ignore()
    private signToken(user: User, { refreshToken, ...opt }: Partial<SignOption> = {}) {
        const role = refreshToken ? "RefreshToken" : user.role
        return sign(<LoginUser>{ userId: user.id, role }, process.env.PLUM_JWT_SECRET!, opt)
    }

    @route.ignore()
    private createTokens(user: User) {
        return {
            // login token
            token: this.signToken(user, { expiresIn: "30m" }),
            // refresh token
            refreshToken: this.signToken(user, { expiresIn: "7d", refreshToken: true })
        };
    }

    @authorize.public()
    @route.post()
    async login(email: string, password: string) {
        const UserModel = model(User)
        const user = await UserModel.findOne({ email })
        if (!user || !await compare(password, user.password))
            throw new HttpStatusError(422, "Invalid username or password")
        const tokens = this.createTokens(user)
        return response.json(tokens)
            // cookie token will never expires, http-only, same-site: lax
            .setCookie("Authorization", this.signToken(user), { sameSite: "lax" })
    }

    @route.post()
    @authorize.route("RefreshToken")
    async refresh(@bind.user() user: LoginUser) {
        const UserModel = model(User)
        const saved = await UserModel.findById(user.userId);
        if (!saved) throw new HttpStatusError(404, "User not found");
        return this.createTokens(saved);
    }

    async logout() {
        // clear cookie
        return response.json({}).setCookie("Authorization")
    }
}