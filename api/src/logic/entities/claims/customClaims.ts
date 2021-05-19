/*
 * Custom claims that originate from the API's own database
 */
export class CustomClaims {

    private _userDatabaseId: string;
    private _isAdmin: boolean;
    private _regionsCovered: string[];

    public constructor(userDatabaseId: string, isAdmin: boolean, regionsCovered: string[]) {
        this._userDatabaseId = userDatabaseId;
        this._isAdmin = isAdmin;
        this._regionsCovered = regionsCovered;
    }

    public get userDatabaseId(): string {
        return this._userDatabaseId;
    }

    public get isAdmin(): boolean {
        return this._isAdmin;
    }

    public get regionsCovered(): string[] {
        return this._regionsCovered;
    }
}
