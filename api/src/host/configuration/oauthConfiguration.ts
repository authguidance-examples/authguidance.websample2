/*
 * A holder for OAuth settings
 */
export interface OAuthConfiguration {
    authority: string;
    clientId: string;
    clientSecret: string;
    maxClaimsCacheMinutes: number;
}
