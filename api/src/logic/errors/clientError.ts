import {ErrorCodes} from './errorCodes';

/*
 * Manage errors due to invalid client usage
 */
export class ClientError extends Error {

    /*
     * A helper method to return a 401 error
     */
    public static create401(reason: string): ClientError {

        const error = new ClientError(
            401,
            ErrorCodes.unauthorizedRequest,
            'Missing, invalid or expired access token');

        error.logContext = reason;
        return error;
    }

    private readonly _statusCode: number;
    private readonly _errorCode: string;
    private _logContext: any;
    private _area: string;
    private _id: number;
    private _utcTime: string;

    /*
     * Construct from mandatory fields
     */
    public constructor(statusCode: number, errorCode: string, message: string) {

        // Set common fields
        super(message);
        this._statusCode = statusCode;
        this._errorCode = errorCode;
        this._logContext = null;

        // Initialise 5xx fields
        this._area = '';
        this._id = 0;
        this._utcTime = '';

        // Ensure that instanceof works
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public get statusCode(): number {
        return this._statusCode;
    }

    /*
     * Set extra fields to return to the caller for 500 errors
     */
    public setExceptionDetails(area: string, id: number, utcTime: string): void {
        this._area = area;
        this._id = id;
        this._utcTime = utcTime;
    }

    /*
     * A 4xx error can be thrown with additional data that is logged for support purposes
     */
    public set logContext(value: any) {
        this._logContext = value;
    }

    /*
     * Return an object that can be serialized by calling JSON.stringify
     */
    public toResponseFormat(): any {

        const body: any = {
            code: this._errorCode,
            message: this.message,
        };

        if (this._id > 0 && this._area.length > 0 && this._utcTime.length > 0) {
            body.id = this._id;
            body.area = this._area;
            body.utcTime = this._utcTime;
        }

        return body;
    }

    /*
     * Similar to the above but includes details outside the response body
     */
    public toLogFormat(): any {

        const data: any = {
            statusCode: this._statusCode,
            clientError: this.toResponseFormat(),
        };

        if (this._logContext) {
            data.context = this._logContext;
        }

        return data;
    }
}
