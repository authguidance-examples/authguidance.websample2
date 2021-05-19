import {CustomClaims} from '../../logic/entities/claims/customClaims';
import {TokenClaims} from '../../logic/entities/claims/tokenClaims';
import {UserInfoClaims} from '../../logic/entities/claims/userInfoClaims';

/*
 * An interface for providing custom claims from the API's own data
 */
export interface CustomClaimsProvider {
    getCustomClaims(token: TokenClaims, userInfo: UserInfoClaims): Promise<CustomClaims>;
}
