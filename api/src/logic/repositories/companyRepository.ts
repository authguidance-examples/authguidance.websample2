import {Company} from '../entities/company';
import {CompanyTransactions} from '../entities/companyTransactions';
import {JsonFileReader} from '../utilities/jsonFileReader';

/*
 * A simple repository class
 */
export class CompanyRepository {

    private readonly _jsonReader: JsonFileReader;

    public constructor(jsonReader: JsonFileReader) {
        this._jsonReader = jsonReader;
    }

    /*
     * Return the list of companies from a hard coded data file
     */
    public async getCompanyList(): Promise<Company[]> {

        return this._jsonReader.readData<Company[]>('data/companyList.json');
    }

    /*
     * Return transactions for a company given its id
     */
    public async getCompanyTransactions(id: number): Promise<CompanyTransactions | null> {

        // Read companies and find that supplied
        const companyList = await this._jsonReader.readData<Company[]>('data/companyList.json');
        const foundCompany = companyList.find((c) => c.id === id);
        if (foundCompany) {

            // Next read transactions from the database
            const companyTransactions =
                await this._jsonReader.readData<CompanyTransactions[]>('data/companyTransactions.json');

            // Then join the data
            const foundTransactions = companyTransactions.find((ct) => ct.id === id);
            if (foundTransactions) {
                foundTransactions.company = foundCompany;
                return foundTransactions;
            }
        }

        // Indicate no data found
        return null;
    }
}
