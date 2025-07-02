export type RegisterResponse = {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}