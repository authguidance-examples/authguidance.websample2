import {Response} from 'express';

/*
 * Helper methods to write the response
 */
export class ResponseWriter {

    /*
     * Return data to the caller, which could be a success or error object
     */
    public static writeObjectResponse(response: Response, statusCode: number, data: any): void {

        response.setHeader('Content-Type', 'application/json');
        if (statusCode === 401) {
            response.setHeader('WWW-Authenticate', 'Bearer');
        }

        response.status(statusCode).send(JSON.stringify(data));
    }
}
