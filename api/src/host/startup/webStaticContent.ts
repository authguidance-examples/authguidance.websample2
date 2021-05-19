import {Request, Response} from 'express';
import path from 'path';

/*
 * Manage static content delivery on a Developer PC
 */
export class WebStaticContent {

    private readonly _webFilesRoot: string;

    public constructor() {
        this._webFilesRoot = '../../../../spa';
        this._setupCallbacks();
    }

    /*
     * Serve up the requested web file
     */
    public getWebResource(request: Request, response: Response): void {

        let resourcePath = request.path.toLowerCase().replace('/spa', '/');
        if (resourcePath === '/') {
            resourcePath = 'index.html';
        }

        const webFilePath = path.join(`${__dirname}/${this._webFilesRoot}/${resourcePath}`);
        response.sendFile(webFilePath);
    }

    /*
     * Serve up the requested web file
     */
    public getWebDefaultResource(request: Request, response: Response): void {

        const webFilePath = path.join(`${__dirname}/${this._webFilesRoot}/index.html`);
        response.sendFile(webFilePath);
    }

    /*
     * Serve up our favicon
     */
    public getFavicon(request: Request, response: Response): void {

        const webFilePath = path.join(`${__dirname}/${this._webFilesRoot}/favicon.ico`);
        response.sendFile(webFilePath);
    }

    /*
     * Set up callbacks
     */
    private _setupCallbacks(): void {
        this.getWebResource = this.getWebResource.bind(this);
        this.getWebDefaultResource = this.getWebDefaultResource.bind(this);
        this.getFavicon = this.getFavicon.bind(this);
    }
}
