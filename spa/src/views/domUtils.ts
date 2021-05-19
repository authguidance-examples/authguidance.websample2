/*
 * A helper class to make document.querySelector calls a safe one liner
 */
export class DomUtils {

    /*
     * Set HTML
     */
    public static html(selector: string, html: string): void {

        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = html;
        }
    }

    /*
     * Set text
     */
    public static text(selector: string, text: string): void {

        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }

    /*
     * Show an element
     */
    public static show(selector: string): void {

        const container = document.querySelector(selector) as HTMLElement;
        if (container) {
            container.style.display = 'block';
        }
    }

    /*
     * Hide an element
     */
    public static hide(selector: string): void {

        const container = document.querySelector(selector) as HTMLElement;
        if (container) {
            container.style.display = 'none';
        }
    }

    /*
     * Add a click handler
     */
    public static onClick(selector: string, callback: () => void): void {
        document.querySelector(selector)?.addEventListener('click', callback);
    }
}