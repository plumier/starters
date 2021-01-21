
export type UserRole = "User" | "Admin"

export interface LoginUser {
    userId: number,
    role: UserRole
    refresh?: true
}