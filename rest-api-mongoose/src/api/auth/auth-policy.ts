import { authPolicy } from "plumier";
import { LoginUser } from "../_shared/login-user";


authPolicy()
    // register Admin role
    .register("Admin", ({user}) => user?.role === "Admin")

    // register User role
    .register("User", ({user}) => user?.role === "User")
    
    // global authorization policy, see how it used in JwtAuthFacility
    .register("Private", i => {
        const user = i.user as (LoginUser | undefined)
        // forbid non login user 
        if (!user) return false
        // forbid refresh token 
        if (user.refresh) return false
        return true
    })

    // refresh token policy, see how it used in AuthController.refresh
    .register("RefreshToken", i => {
        const user = i.user as (LoginUser | undefined)
        // only allow if jwt claim contains refresh token
        return !!user?.refresh
    })