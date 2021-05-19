import {HttpOptions} from 'openid-client';
import TunnelAgent from 'tunnel-agent';
import url from 'url';

/*
 * Manage supplying the HTTP proxy on calls from the API to the Authorization Server
 */
export class HttpProxy {

    /*
     * Create the HTTP agent at application startup
     */
    public static initialize(useProxy: boolean, proxyUrl: string): void {

        if (useProxy) {
            const opts = url.parse(proxyUrl);
            HttpProxy._agent = TunnelAgent.httpsOverHttp({
                proxy: opts,
            });
        }
    }

    /*
     * Configure Open Id Client HTTP options, including the proxy
     */
    public static getOptions(options: HttpOptions): HttpOptions {

        options.agent = {
            https: HttpProxy._agent,
        };

        return options;
    }

    // The global proxy agent
    private static _agent: any = null;
}
