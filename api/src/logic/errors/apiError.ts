import {ClientError} from './clientError';

/*
 * A range for random error ids
 */
const MIN_ERROR_ID = 10000;
const MAX_ERROR_ID = 99999;

/*
 * An error entity that the API will log
 */
export class ApiError extends Error {

    private readonly _statusCode: number;
    private readonly _apiName: string;
    private readonly _errorCode: string;
    private readonly _instanceId: number;
    private readonly _utcTime: string;
    private _details: any;

    /*
     * Errors are categorized by error code
     */
    public constructor(errorCode: string, userMessage: string, stack?: string | undefined) {

        super(userMessage);

        // Give fields their default values
        this._statusCode = 500;
        this._apiName = 'BasicApi';
        this._errorCode = errorCode;
        this._instanceId = Math.floor(Math.random() * (MAX_ERROR_ID - MIN_ERROR_ID + 1) + MIN_ERROR_ID);
        this._utcTime = new Date().toISOString();
        this._details = '';

        // Record the stack trace of the original error
        if (stack) {
            this.stack = stack;
        }

        // Ensure that instanceof works
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public get details(): any {
        return this._details;
    }

    public set details(details: any) {
        this._details = details;
    }

    /*
     * Return an object ready to log, including the stack trace
     */
    public toLogFormat(): any {

        const serviceError: any = {
        };

        if (this.details) {
            serviceError.details =  this._details;
        }

        // Include the stack trace as an array within the JSON object
        if (this.stack) {

            const frames: string[] = [];
            const items = this.stack.split('\n').map((x: string) => x.trim());
            items.forEach((i) => {
                frames.push(i);
            });

            serviceError.stack = frames;
        }

        return {
            statusCode: this._statusCode,
            clientError: this.toClientError().toResponseFormat(),
            serviceError,
        };
    }

    /*
     * Translate to a confidential and supportable error response to return to the API caller
     */
    public toClientError(): ClientError {

        // Return the error code to the client
        const error = new ClientError(this._statusCode, this._errorCode, this.message);

        // Also indicate which part of the system, where in logs and when the error occurred
        error.setExceptionDetails(this._apiName, this._instanceId, this._utcTime);
        return error;
    }
}
