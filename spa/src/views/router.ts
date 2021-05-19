import urlparse from 'url-parse';
import {ApiClient} from '../api/client/apiClient';
import {CompaniesView} from './companiesView';
import {ErrorView} from './errorView';
import {LoginRequiredView} from './loginRequiredView';
import {TransactionsView} from './transactionsView';

/*
 * A very primitive router to deal with switching views
 */
export class Router {

    private _apiClient: ApiClient;
    private _errorView: ErrorView;

    public constructor(apiClient: ApiClient, errorView: ErrorView) {
        this._apiClient = apiClient;
        this._errorView = errorView;
    }

    /*
     * Execute a view based on the hash URL data
     */
    public async loadView(): Promise<void> {

        // Clear errors from the previous view
        this._errorView.clear();

        // Our simple router works out which main view to show from a couple of known hash fragments
        if (this.isInLoggedOutView()) {

            // If the user has explicitly logged out show this view
            const view = new LoginRequiredView();
            await view.load();

        } else {

            // The transactions view has a URL such as #company=2
            const transactionsCompany = this.getTransactionsViewId();
            if (transactionsCompany) {

                // If there is an id we move to the transactions view
                const view = new TransactionsView(this._apiClient, transactionsCompany);
                await view.load();

            } else {

                // Otherwise we show the companies list view
                const view = new CompaniesView(this._apiClient);
                await view.load();
            }
        }
    }

    /*
     * Return true if we are in the home view
     */
    public isInHomeView(): boolean {
        return !this.getTransactionsViewId() && !this.isInLoggedOutView();
    }

    /*
     * The transactions view has a URL such as #company=2
     */
    public getTransactionsViewId(): string {

        const hashData = this._getLocationHashData();
        return hashData.company;
    }

    /*
     * The logged out view has some special logic related to not showing user info
     */
    public isInLoggedOutView(): boolean {
        return location.hash.indexOf('loggedout') !== -1;
    }

    /*
     * Get hash fragments into a dictionary
     */
    private _getLocationHashData(): any {

        if (location.hash.startsWith('#')) {
            const data = urlparse('?' + location.hash.substring(1), true);
            if (data && data.query)  {
                return data.query;
            }
        }

        return {};
    }
}
