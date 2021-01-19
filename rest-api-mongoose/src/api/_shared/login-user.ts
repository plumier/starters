

export interface LoginUser {
    userId: string,
    role: "User" | "Admin" | "RefreshToken"
}