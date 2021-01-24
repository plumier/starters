
export interface LoginUser {
    userId: string,
    role: "User" | "Admin"
    refresh?: true
}