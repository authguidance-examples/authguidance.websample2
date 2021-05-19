import {App} from './app/app';
import {IFrameApp} from './app/iframeApp';

/*
 * The application entry point
 */
if (window.top === window.self) {

    // Run the main app
    const app = new App();
    app.execute();

} else {

    // If our SPA is running on an iframe, handle token renewal responses
    const app = new IFrameApp();
    app.execute();
}
