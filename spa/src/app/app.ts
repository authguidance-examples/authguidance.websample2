import {ApiClient} from '../api/client/apiClient';
import {Configuration} from '../configuration/configuration';
import {ConfigurationLoader} from '../configuration/configurationLoader';
import {ErrorConsoleReporter} from '../plumbing/errors/errorConsoleReporter';
import {Authenticator} from '../plumbing/oauth/authenticator';
import {OidcLogger} from '../plumbing/utilities/oidcLogger';
import {ErrorView} from '../views/errorView';
import {HeaderButtonsView} from '../views/headerButtonsView';
import {Router} from '../views/router';
import {TitleView} from '../views/titleView';

/*
 * The application class
 */
export class App {

    private _configuration?: Configuration;
    private _authenticator?: Authenticator;
    private _apiClient?: ApiClient;
    private _oidcLogger: OidcLogger;
    private _router?: Router;
    private _titleView?: TitleView;
    private _headerButtonsView?: HeaderButtonsView;
    private _errorView?: ErrorView;
    private _isInitialised: boolean;

    public constructor() {
        this._isInitialised = false;
        this._oidcLogger = new OidcLogger();
        this._setupCallbacks();
    }

    /*
     * The entry point for the SPA
     */
    public async execute(): Promise<void> {

        try {

            // Start listening for hash changes
            window.onhashchange = this._onHashChange;

            // Do the initial render
            this._initialRender();

            // Do one time app initialisation
            await this._initialiseApp();

            // We must be prepared for page invocation to be an OAuth response
            await this._authenticator!.handleLoginResponse();

            // Load the main view, which may trigger a login redirect
            await this._loadMainView();

            // Get user info from the API unless we are in the logged out view
            if (!this._router!.isInLoggedOutView()) {
                await this._loadUserInfo();
            }

        } catch (e) {

            // Report failures
            this._errorView?.report(e);
        }
    }

    /*
     * Render views in their initial state
     */
    private _initialRender() {

        this._titleView = new TitleView();
        this._titleView.load();

        this._headerButtonsView = new HeaderButtonsView(
            this._onHome,
            this._onReloadData,
            this._onExpireToken,
            this._onLogout);
        this._headerButtonsView.load();

        this._errorView = new ErrorView();
        this._errorView.load();
    }

    /*
     * Initialise the app
     */
    private async _initialiseApp(): Promise<void> {

        // Download application configuration
        this._configuration = await ConfigurationLoader.download('spa.config.json');

        // Initialise our OIDC Client wrapper
        this._authenticator = new Authenticator(
            this._configuration.app.webBaseUrl,
            this._configuration.oauth,
            this._onExternalTabLogout);

        // Create a client to reliably call the API
        this._apiClient = new ApiClient(this._configuration.app.apiBaseUrl, this._authenticator);

        // Our simple router passes the API Client instance between views
        this._router = new Router(this._apiClient, this._errorView!);

        // Update state to indicate that global objects are loaded
        this._isInitialised = true;
    }

    /*
     * Load API data for the main view and update UI controls
     */
    private async _loadMainView(): Promise<void> {

        // Indicate busy
        this._headerButtonsView!.disableSessionButtons();

        // Load the view
        await this._router!.loadView();

        if (this._router!.isInLoggedOutView()) {

            // If we are logged out then clear user info
            this._clearUserInfo();

        } else {

            // Otherwise re-enable buttons
            this._headerButtonsView!.enableSessionButtons();
        }
    }

    /*
     * Load API data for the user info fragment
     */
    private async _loadUserInfo(): Promise<void> {
        await this._titleView!.loadUserInfo(this._apiClient!);
    }

    /*
     * Load API data for the user info fragment
     */
    private _clearUserInfo(): void {
        this._titleView!.clearUserInfo();
    }

    /*
     * Change the view based on the hash URL and catch errors
     */
    private async _onHashChange(): Promise<void> {

        // Handle updates to log levels when the URL log setting is changed
        this._oidcLogger.updateLogLevelIfRequired();

        try {

            // Run main view navigation
            if (this._isInitialised) {
                await this._loadMainView();
            }

        } catch (e) {

            // Report failures
            this._errorView!.report(e);
        }
    }

    /*
     * The home button moves to the home view but also deals with error recovery
     */
    private async _onHome(): Promise<void> {

        try {

            // Retry if the app failed to initialise
            if (!this._isInitialised) {
                await this._initialiseApp();
            }

            if (this._isInitialised) {

                if (this._router!.isInHomeView()) {

                    // Force a reload if we are already in the home view
                    await this._loadMainView();

                } else {

                    // Otherwise move to the home view
                    location.hash = '#';
                }
            }

        } catch (e) {

            // Report failures
            this._errorView!.report(e);
        }
    }

    /*
     * Force both API calls when reload is clicked
     */
    private async _onReloadData(): Promise<void> {

        try {
            await this._loadMainView();
            await this._loadUserInfo();

        } catch (e) {

            this._errorView!.report(e);
        }
    }

    /*
     * Perform a logout request
     */
    private async _onLogout(): Promise<void> {

        try {

            // Start the logout redirect
            await this._authenticator!.startLogout();

        } catch (e) {

            // On error, only output logout errors to the console, then move to the logged out view
            ErrorConsoleReporter.output(e);
            location.hash = '#loggedout';
        }
    }

    /*
     * Handle logout notifications from other browser tabs
     * This will only work for Authorization Servers with check session iframe support
     */
    private _onExternalTabLogout(): void {
        location.hash = '#loggedout';
    }

    /*
     * Force a new access token to be retrieved
     */
    private async _onExpireToken(): Promise<void> {
        await this._authenticator!.expireAccessToken();
    }

    /*
     * Plumbing to ensure that the this parameter is available in async callbacks
     */
    private _setupCallbacks(): void {
        this._onHashChange = this._onHashChange.bind(this);
        this._onHome = this._onHome.bind(this);
        this._onReloadData = this._onReloadData.bind(this);
        this._onLogout = this._onLogout.bind(this);
        this._onExternalTabLogout = this._onExternalTabLogout.bind(this);
        this._onExpireToken = this._onExpireToken.bind(this);
    }
}
