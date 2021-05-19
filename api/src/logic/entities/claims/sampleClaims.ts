import {CustomClaims} from './customClaims';
import {TokenClaims} from './tokenClaims';
import {UserInfoClaims} from './userInfoClaims';

/*
 * Our claims principal
 */
export class SampleClaims {

    private _tokenClaims: TokenClaims;
    private _userInfoClaims: UserInfoClaims;
    private _customClaims: CustomClaims;

    public constructor(tokenClaims: TokenClaims, userInfoClaims: UserInfoClaims, customClaims: CustomClaims) {
        this._tokenClaims = tokenClaims;
        this._userInfoClaims = userInfoClaims;
        this._customClaims = customClaims;
    }

    public get token(): TokenClaims {
        return this._tokenClaims;
    }

    public get userInfo(): UserInfoClaims {
        return this._userInfoClaims;
    }

    public get custom(): CustomClaims {
        return this._customClaims;
    }
}
