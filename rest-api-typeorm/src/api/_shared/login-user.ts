
export interface LoginUser {
    userId: number,
    role: "User" | "Admin"
    refresh?: true
}