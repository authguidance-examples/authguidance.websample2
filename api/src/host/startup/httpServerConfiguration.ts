import cors from 'cors';
import {Application, NextFunction, Request, Response} from 'express';
import fs from 'fs-extra';
import https from 'https';
import {ListenOptions} from 'node:net';
import {Configuration} from '../configuration/configuration';
import {Router} from '../routing/router';
import {ApiLogger} from '../utilities/apiLogger';
import {WebStaticContent} from './webStaticContent';

/*
 * Configure HTTP behaviour at application startup
 */
export class HttpServerConfiguration {

    private readonly _expressApp: Application;
    private readonly _configuration: Configuration;
    private readonly _router: Router;
    private readonly _webStaticContent: WebStaticContent;

    public constructor(expressApp: Application, configuration: Configuration) {
        this._expressApp = expressApp;
        this._configuration = configuration;
        this._router = new Router(this._configuration);
        this._webStaticContent = new WebStaticContent();
    }

    /*
     * Set up Web API routes and initialize the API
     */
    public async initializeApi(): Promise<void> {

        // Allow cross origin requests from the SPA and disable API response caching
        const corsOptions = { origin: this._configuration.api.trustedOrigins };
        this._expressApp.use('/api/*', cors(corsOptions) as any);
        this._expressApp.use('/api/*', this._router.cacheHandler);

        // All API requests are authorized first
        this._expressApp.use('/api/*', this._catch(this._router.authorizationHandler));

        // API routes containing business logic
        this._expressApp.get('/api/userinfo', this._catch(this._router.getUserInfo));
        this._expressApp.get('/api/companies', this._catch(this._router.getCompanyList));
        this._expressApp.get('/api/companies/:id/transactions', this._catch(this._router.getCompanyTransactions));

        // Handle failure scenarios
        this._expressApp.use('/api/*', this._router.notFoundHandler);
        this._expressApp.use('/api/*', this._router.unhandledExceptionHandler);

        // Prepate the API to handle secured requests
        await this._router.initialize();
    }

    /*
     * The sample also provides some simple hosting of web static content, for convenience
     */
    public initializeWebStaticContentHosting(): void {

        this._expressApp.get('/spa/*', this._webStaticContent.getWebResource);
        this._expressApp.get('/spa', this._webStaticContent.getWebDefaultResource);
        this._expressApp.get('/favicon.ico', this._webStaticContent.getFavicon);
    }

    /*
     * Start serving requests
     */
    public async startListening(): Promise<void> {

        const listenOptions: ListenOptions = {
            port: this._configuration.api.port,
        };

        if (this._configuration.api.sslCertificateFileName && this._configuration.api.sslCertificatePassword) {

            // Load the certificate file from disk
            const pfxFile = await fs.readFile(this._configuration.api.sslCertificateFileName);
            const sslOptions = {
                pfx: pfxFile,
                passphrase: this._configuration.api.sslCertificatePassword,
            };

            // Start listening on HTTPS
            const httpsServer = https.createServer(sslOptions, this._expressApp);
            httpsServer.listen(listenOptions.port, () => {
                ApiLogger.info(`API is listening on HTTPS port ${listenOptions.port}`);
            });

        } else {

            // Otherwise listen over HTTP
            this._expressApp.listen(listenOptions, () => {
                console.log(`API is listening on HTTP port ${listenOptions.port}`);
            });
        }
    }

    /*
     * Deal with Express unhandled promise exceptions during async API requests
     * https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
     */
    private _catch(fn: any): any {

        return (request: Request, response: Response, next: NextFunction) => {

            Promise
                .resolve(fn(request, response, next))
                .catch((e) => {
                    this._router.unhandledExceptionHandler(e, request, response);
                });
        };
    }
}
