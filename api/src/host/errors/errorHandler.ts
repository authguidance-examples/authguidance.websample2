import {ApiError} from '../../logic/errors/apiError';
import {ClientError} from '../../logic/errors/clientError';
import {ErrorCodes} from '../../logic/errors/errorCodes';
import {ApiLogger} from '../utilities/apiLogger';

/*
 * A class to handle composing and reporting errors
 */
export class ErrorHandler {

    /*
     * Handle the server error and get client details
     */
    public static handleError(exception: any): ClientError {

        // Ensure that the exception has a known type
        const handledError = ErrorHandler.fromException(exception);
        if (exception instanceof ClientError) {

            // Client errors mean the caller did something wrong
            const clientError = handledError as ClientError;

            // Log the error
            const errorToLog = clientError.toLogFormat();
            ApiLogger.error(JSON.stringify(errorToLog, null, 2));

            // Return the API response to the caller
            return clientError;

        } else {

            // API errors mean we experienced a failure
            const apiError = handledError as ApiError;

            // Log the error with an id
            const errorToLog = apiError.toLogFormat();
            ApiLogger.error(JSON.stringify(errorToLog, null, 2));

            // Return the API response to the caller
            return apiError.toClientError();
        }
    }

    /*
     * Ensure that all errors are of a known type
     */
    public static fromException(exception: any): ApiError | ClientError {

        // Already handled 500 errors
        if (exception instanceof ApiError) {
            return exception;
        }

        // Already handled 4xx errors
        if (exception instanceof ClientError) {
            return exception;
        }

        // Handle general exceptions
        const apiError = new ApiError(
            ErrorCodes.serverError,
            'An unexpected exception occurred in the API',
            exception.stack);

        apiError.details = this._getExceptionDetails(exception);
        return apiError;
    }

    /*
     * Handle requests to API routes that don't exist
     */
    public static fromRequestNotFound(): ClientError {

        return new ClientError(
            404,
            ErrorCodes.requestNotFound,
            'An API request was sent to a route that does not exist');
    }

    /*
     * Handle the request promise error for metadata lookup failures
     */
    public static fromMetadataError(responseError: any, url: string): ApiError {

        const apiError = new ApiError(
            ErrorCodes.metadataLookupFailure,
            'Metadata lookup failed',
            responseError.stack);

        ErrorHandler._updateErrorFromHttpResponse(apiError, url, responseError);
        return apiError;
    }

    /*
     * Handle introspection failures
     */
    public static fromIntrospectionError(responseError: any, url: string): ApiError | ClientError {

        // Avoid reprocessing
        if (responseError instanceof ApiError) {
            return responseError;
        }
        if (responseError instanceof ClientError) {
            return responseError;
        }

        const apiError = new ApiError(
            ErrorCodes.introspectionFailure,
            'Token validation failed',
            responseError.stack);

        ErrorHandler._updateErrorFromHttpResponse(apiError, url, responseError);
        return apiError;
    }

    /*
     * Handle user info lookup failures
     */
    public static fromUserInfoError(responseError: any, url: string): ApiError | ClientError {

        // Handle a race condition where the access token expires during user info lookup
        if (responseError.error && responseError.error === 'invalid_token') {
            throw ClientError.create401('Access token expired during user info lookup');
        }

        // Avoid reprocessing
        if (responseError instanceof ApiError) {
            return responseError;
        }

        const apiError = new ApiError(
            ErrorCodes.userinfoFailure,
            'User info lookup failed',
            responseError.stack);

        ErrorHandler._updateErrorFromHttpResponse(apiError, url, responseError);
        return apiError;
    }

    /*
     * The error thrown if we cannot find an expected claim during OAuth processing
     */
    public static fromMissingClaim(claimName: string): ApiError {

        const apiError = new ApiError(ErrorCodes.claimsFailure, 'Authorization Data Not Found');
        apiError.details = `An empty value was found for the expected claim ${claimName}`;
        return apiError;
    }

    /*
     * Update error fields with OAuth response details
     */
    private static _updateErrorFromHttpResponse(
        apiError: ApiError,
        url: string,
        responseError: any): void {

        if (responseError.error && responseError.error_description) {

            // Include OAuth error details if returned
            apiError.message += ` : ${responseError.error}`;
            apiError.details = responseError.error_description;
        } else {

            // Otherwise capture exception details
            apiError.details = this._getExceptionDetails(responseError);
        }

        // Include the URL in the error details
        apiError.details += `, URL: ${url}`;
    }

    /*
     * Get the message from an exception and avoid returning [object Object]
     */
    private static _getExceptionDetails(e: any): string {

        if (e.message) {
            return e.message;
        } else {
            const details = e.toString();
            if (details !== {}.toString()) {
                return details;
            } else {
                return '';
            }
        }
    }
}
