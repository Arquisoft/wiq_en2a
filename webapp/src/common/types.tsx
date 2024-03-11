export type User = {
    name: string;
    points: string;
    isAuthenticated: boolean;
  }

export type UserContexType = {
    AuthUser: User;
    setAuthUser: (value: User) => void;
}