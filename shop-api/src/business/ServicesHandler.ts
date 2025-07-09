export class ServicesHandler<T> {
    message: string = "";
    isSucceed: boolean = false;
    body: T | null = null;
    refreshToken: string | null = null;
}