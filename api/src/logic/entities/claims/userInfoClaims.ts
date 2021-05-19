/*
 * Claims containg user details
 */
export class UserInfoClaims {

    private _givenName: string;
    private _familyName: string;
    private _email: string;

    public constructor(givenName: string, familyName: string, email: string) {
        this._givenName = givenName;
        this._familyName = familyName;
        this._email = email;
    }

    public get givenName(): string {
        return this._givenName;
    }

    public get familyName(): string {
        return this._familyName;
    }

    public get email(): string {
        return this._email;
    }
}
