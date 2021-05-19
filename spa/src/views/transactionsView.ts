import mustache from 'mustache';
import {ApiClient} from '../api/client/apiClient';
import {CompanyTransactions} from '../api/entities/companyTransactions';
import {ErrorCodes} from '../plumbing/errors/errorCodes';
import {DomUtils} from './domUtils';

/*
 * The transactions view takes up the entire screen except for the header
 */
export class TransactionsView {

    private readonly _apiClient: ApiClient;
    private readonly _companyId: string;

    public constructor(apiClient: ApiClient, companyId: string) {
        this._apiClient = apiClient;
        this._companyId = companyId;
    }

    /*
    * Wait for data then render it
    */
    public async load(): Promise<void> {

        try {

            // Clear existing content
            DomUtils.text('#main', '');

            // Try to get data
            const data = await this._apiClient.getCompanyTransactions(this._companyId);

            // Render new content
            this._renderData(data);

        } catch (uiError) {

            // Handle invalid input due to typing an id into the browser address bar
            if (uiError.statusCode === 404 && uiError.errorCode === ErrorCodes.companyNotFound) {

                // User typed an id value outside of valid company ids
                location.hash = '#';

            } else if (uiError.statusCode === 400 && uiError.errorCode === ErrorCodes.invalidCompanyId) {

                // User typed an invalid id such as 'abc'
                location.hash = '#';

            } else {

                // Rethrow otherwise
                throw uiError;
            }
        }
    }

    /*
     * Render data after receiving it from the API
     */
    /* eslint-disable max-len */
    private _renderData(data: CompanyTransactions): void {

        // Build a view model from the data
        const viewModel = {
            title: `Today's Transactions for ${data.company.name}`,
            transactions: data.transactions.map((transaction) => {
                return {
                    id: transaction.id,
                    investorId: transaction.investorId,
                    formattedAmountUsd: Number(transaction.amountUsd).toLocaleString(),
                };
            }),
        };

        const htmlTemplate =
            `<div class='card border-0'>
                <div class='card-header row font-weight-bold'>
                    <div class='col-12 text-center mx-auto font-weight-bold'>
                        {{title}}
                    </div>
                </div>
                <div class='row'>
                    {{#transactions}}
                        <div class='col-lg-4 col-md-6 col-xs-12'>
                            <div class='card'>
                                <div class='card-body'>
                                    <div class='row'>
                                        <div class='col-6'>Transaction ID</div>
                                        <div class='col-6 text-right valuecolor font-weight-bold'>{{id}}</div>
                                    </div>
                                    <div class='row'>
                                        <div class='col-6'>Investor ID</div>
                                        <div class='col-6 text-right valuecolor font-weight-bold'>{{investorId}}</div>
                                    </div>
                                    <div class='row'>
                                        <div class='col-6'>Amount USD</div>
                                        <div class='col-6 text-right moneycolor font-weight-bold'>{{formattedAmountUsd}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {{/transactions}}
                </div>
            </div>`;

        // Update the main elemnent's content in a manner that handles dangerous characters correctly
        const html = mustache.render(htmlTemplate, viewModel);
        DomUtils.html('#main', html);
    }
}
