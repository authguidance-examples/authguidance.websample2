/*
 * Error codes that the UI can program against
 */
export class ErrorCodes {

    // Used to indicate that the API cannot be called until the user logs in
    // Also returned by OAuth error responses when token renewal via prompt=none fails
    public static readonly loginRequired = 'login_required';

    // A technical error starting a login request, such as contacting the metadata endpoint
    public static readonly loginRequestFailed = 'login_request_failed';

    // A technical error processing the login response containing the authorization code
    public static readonly loginResponseFailed = 'login_response_failed';

    // A technical problem during silent token renewal
    public static readonly tokenRenewalError = 'token_renewal_error';

    // An error starting a logout request, such as contacting the metadata endpoint
    public static readonly logoutRequestFailed = 'logout_request_failed';

    // A general exception in the UI
    public static readonly generalUIError = 'ui_error';

    // An error making an Ajax call to get API data
    public static readonly networkError = 'network_error';

    // An error receiving API data as JSON
    public static readonly jsonDataError = 'json_data_error';

    // An error response from the API
    public static readonly responseError = 'http_response_error';

    // Returned by the API when the user edits the browser URL to a not found value
    public static readonly companyNotFound = 'company_not_found';

    // Returned by the API when the user edits the browser URL and supplies a non numeric company id
    public static readonly invalidCompanyId = 'invalid_company_id';
}
