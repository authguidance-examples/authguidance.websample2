/*
 * A simple company entity
 */
export interface Company {
    id: number;
    name: string;
    region: string;
    targetUsd: number;
    investmentUsd: number;
    noInvestors: number;
}
