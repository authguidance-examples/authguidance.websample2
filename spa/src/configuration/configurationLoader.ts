import axios from 'axios';
import {Configuration} from '../configuration/configuration';
import {AxiosUtils} from '../plumbing/utilities/axiosUtils';
import {ErrorHandler} from '../plumbing/errors/errorHandler';

/*
 * Logic related to making HTTP calls
 */
export class ConfigurationLoader {

    /*
     * Download JSON data from the app config file
     */
    public static async download(fileName: string): Promise<Configuration> {

        try {

            const response = await axios.get<Configuration>(fileName);
            AxiosUtils.checkJson(response.data);
            return response.data;

        } catch (xhr) {

            throw ErrorHandler.getFromHttpError(xhr, fileName, 'Web Server');
        }
    }
}
