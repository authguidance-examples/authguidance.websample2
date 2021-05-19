import mustache from 'mustache';
import {ApiClient} from '../api/client/apiClient';
import {Company} from '../api/entities/company';
import {DomUtils} from './domUtils';

/*
 * The companies list view takes up the entire screen except for the header
 */
export class CompaniesView {

    private readonly _apiClient: ApiClient;

    public constructor(apiClient: ApiClient) {
        this._apiClient = apiClient;
    }

    /*
     * Wait for data then render it
     */
    public async load(): Promise<void> {

        // Clear existing content
        DomUtils.text('#main', '');

        // Try to get data
        const data = await this._apiClient.getCompanyList();

        // Render new content
        this._renderData(data);
    }

    /*
     * Render HTML based on the API response
     */
    private _renderData(data: Company[]): void {

        // Build a view model from the API data
        const viewModel = {} as any;
        viewModel.companies = data.map((company: Company) => {
            return {
                id: company.id,
                name: company.name,
                region: company.region,
                formattedTargetUsd: Number(company.targetUsd).toLocaleString(),
                formattedInvestmentUsd: Number(company.investmentUsd).toLocaleString(),
                noInvestors: company.noInvestors,
            };
        });

        // Construct a template
        const htmlTemplate =
            `<div class='card border-0'>
                <div class='card-header row'>
                <div class ='col-2 font-weight-bold text-center'>Account</div>
                    <div class ='col-2 font-weight-bold text-center'>Region</div>
                    <div class ='col-2'></div>
                    <div class ='col-2 font-weight-bold text-right'>Target USD</div>
                    <div class ='col-2 font-weight-bold text-right'>Investment USD</div>
                    <div class ='col-2 font-weight-bold text-right'># Investors</div>
                </div>
                <div class='card-body'>
                    {{#companies}}
                        <div class='row listRow'>
                            <div class='col-2 my-auto text-center'>
                                {{name}}
                            </div>
                            <div class='col-2 my-auto text-center'>
                                {{region}}
                            </div>
                            <div class='col-2 my-auto text-center'>
                                <a href='#company={{id}}'>View Transactions</a>
                            </div>
                            <div class='col-2 my-auto moneycolor font-weight-bold text-right'>
                                {{formattedTargetUsd}}<br/>
                            </div>
                            <div class='col-2 my-auto moneycolor font-weight-bold text-right'>
                                {{formattedInvestmentUsd}}
                            </div>
                            <div class='col-2 my-auto font-weight-bold text-right'>
                                {{noInvestors}}
                            </div>
                        </div>
                    {{/companies}}
                </div>
            </div>`;

        // Update the main elemnent's content in a manner that handles dangerous characters correctly
        const html = mustache.render(htmlTemplate, viewModel);
        DomUtils.html('#main', html);
    }
}
