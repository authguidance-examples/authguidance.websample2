import {CustomClaims} from '../entities/claims/customClaims';
import {Company} from '../entities/company';
import {CompanyTransactions} from '../entities/companyTransactions';
import {ClientError} from '../errors/clientError';
import {ErrorCodes} from '../errors/errorCodes';
import {CompanyRepository} from '../repositories/companyRepository';

/*
 * Our service layer class applies logic before returning data
 */
export class CompanyService {

    private readonly _repository: CompanyRepository;
    private readonly _claims: CustomClaims;

    public constructor(repository: CompanyRepository, claims: CustomClaims) {
        this._repository = repository;
        this._claims = claims;
    }

    /*
     * Return the list of companies
     */
    public async getCompanyList(): Promise<Company[]> {

        // Get all companies
        const companies = await this._repository.getCompanyList();

        // Filter on those the user is authorized to access
        return companies.filter((c) => this._isUserAuthorizedForCompany(c));
    }

    /*
     * Return the transaction details for a company
     */
    public async getCompanyTransactions(id: number): Promise<CompanyTransactions> {

        // Forward to the repository class
        const data = await this._repository.getCompanyTransactions(id);

        // If the user is unauthorized or data was not found then return 404
        if (!data || !this._isUserAuthorizedForCompany(data.company)) {
            throw this._unauthorizedError(id);
        }

        return data;
    }

    /*
     * A simple example of applying domain specific claims
     */
    private _isUserAuthorizedForCompany(company: Company): boolean {

        if (this._claims.isAdmin) {
            return true;
        }

        const found = this._claims.regionsCovered.find((c) => c === company.region);
        return !!found;
    }

    /*
     * Return a 404 error if a company is requested that is outside an allowed range
     */
    private _unauthorizedError(companyId: number): ClientError {

        return new ClientError(
            404,
            ErrorCodes.companyNotFound,
            `Company ${companyId} was not found for this user`);
    }
}
