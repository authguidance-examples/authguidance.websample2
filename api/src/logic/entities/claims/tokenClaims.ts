import {ClientError} from '../../errors/clientError';
import {ErrorCodes} from '../../errors/errorCodes';

/*
 * Claims included in the JWT
 */
export class TokenClaims {

    private _subject: string;
    private _scopes: string[];
    private _expiry: number;

    public constructor(subject: string, scopes: string[], expiry: number) {
        this._subject = subject;
        this._scopes = scopes;
        this._expiry = expiry;
    }

    public get subject(): string {
        return this._subject;
    }

    public get scopes(): string[] {
        return this._scopes;
    }

    public get expiry(): number {
        return this._expiry;
    }

    /*
     * Verify that we are allowed to access this type of data, via the scopes from the token
     */
    public verifyScope(requiredScope: string): void {

        if (!this.scopes.some((s) => s.indexOf(requiredScope) !== -1)) {

            throw new ClientError(
                403,
                ErrorCodes.insufficientScope,
                'Access token does not have a valid scope for this API endpoint');
        }
    }
}
