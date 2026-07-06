const ROLE = {
    ADMIN: "admin",
    TEACHER: "teacher",
    STUDENT: "student"
} as const;
export type IRole = (typeof ROLE)[keyof typeof ROLE]
export default ROLE