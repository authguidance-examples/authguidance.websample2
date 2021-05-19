import {Client, custom, Issuer} from 'openid-client';
import {OAuthConfiguration} from '../configuration/oauthConfiguration';
import {ErrorHandler} from '../errors/errorHandler';
import {HttpProxy} from '../utilities/httpProxy';

/*
 * A singleton to read metadata at application startup
 */
export class IssuerMetadata {

    private readonly _oauthConfig: OAuthConfiguration;
    private _issuer: Issuer<Client> | null;

    public constructor(oauthConfig: OAuthConfiguration) {
        this._oauthConfig = oauthConfig;
        this._issuer = null;
        Issuer[custom.http_options] = HttpProxy.getOptions;
    }

    /*
     * Load the metadata at startup, and the process ends if this fails
     */
    public async load(): Promise<void> {

        try {
            const endpoint = `${this._oauthConfig.authority}/.well-known/openid-configuration`;
            this._issuer = await Issuer.discover(endpoint);

        } catch (e) {
            throw ErrorHandler.fromMetadataError(e, this._oauthConfig.authority);
        }
    }

    /*
     * Return the metadata for use during API requests
     */
    public get issuer(): Issuer<Client> {
        return this._issuer!;
    }
}
