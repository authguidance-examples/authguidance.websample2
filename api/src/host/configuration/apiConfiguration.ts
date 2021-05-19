/*
 * A holder for application settings
 */
export interface ApiConfiguration {
    port: number;
    sslCertificateFileName: string;
    sslCertificatePassword: string;
    trustedOrigins: string[];
    useProxy: boolean;
    proxyUrl: string;
}
