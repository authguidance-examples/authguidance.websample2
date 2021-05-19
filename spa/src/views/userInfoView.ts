import mustache from 'mustache';
import {ApiClient} from '../api/client/apiClient';
import {DomUtils} from './domUtils';

/*
 * The user info view renders details of the logged in user
 */
export class UserInfoView {

    /*
     * Run the view
     */
    public async load(apiClient: ApiClient): Promise<void> {

        // Make the API call to get user info
        const userInfo = await apiClient.getUserInfo();

        // Render results
        if (userInfo && userInfo.givenName && userInfo.familyName) {

            const text = mustache.render('{{givenName}} {{familyName}}', userInfo);
            DomUtils.text('#username', text);
        }
    }

    /*
     * Clear the view when we are logged out
     */
    public clear(): void {
        DomUtils.text('#username', '');
    }
}
