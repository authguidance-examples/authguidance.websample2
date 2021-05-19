/*
 * A utility class to keep our HTML storage organised
 */
export class HtmlStorageHelper {

    private static _prefix = 'basicspa.'
    private static _isLoggedInField = 'loggedin';
    private static _oidcLogLevelKeyName = 'oidc-log-level';

    /*
     * Return true if the user logged in on any tab
     */
    public static get isLoggedIn(): boolean {

        const key = `${HtmlStorageHelper._prefix}${HtmlStorageHelper._isLoggedInField}`;
        const value = localStorage.getItem(key);
        return !!value;
    }

    /*
     * Record that the user logged in on a tab
     */
    public static set isLoggedIn(value: boolean) {

        const key = `${HtmlStorageHelper._prefix}${HtmlStorageHelper._isLoggedInField}`;
        localStorage.setItem(key, String(value));
    }

    /*
     * Remove the logged in field
     */
    public static removeLoggedIn(): void {

        const key = `${HtmlStorageHelper._prefix}${HtmlStorageHelper._isLoggedInField}`;
        localStorage.removeItem(key);
    }

    /*
     * Get the log level for viewing OIDC client library details
     */
    public static get oidcLogLevel(): string {

        const key = `${HtmlStorageHelper._prefix}${HtmlStorageHelper._oidcLogLevelKeyName}`;
        return sessionStorage.getItem(key) || '';
    }

    /*
     * Record the log level for viewing OIDC client library details
     */
    public static set oidcLogLevel(value: string) {

        const key = `${HtmlStorageHelper._prefix}${HtmlStorageHelper._oidcLogLevelKeyName}`;
        sessionStorage.setItem(key, value);
    }
}
