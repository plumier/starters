import  "plumier"

declare module "plumier" {
    // augment the JWT Claims object (represent the current login user)
    interface JwtClaims {
        userId: string,
        role: "User" | "Admin"
        refresh?: true
    }
}