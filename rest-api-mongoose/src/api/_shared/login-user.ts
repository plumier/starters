
export type UserRole = "User" | "Admin"

export interface LoginUser {
    userId: string,
    role: UserRole
    refresh?: true
}