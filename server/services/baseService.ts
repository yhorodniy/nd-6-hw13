import { db } from '../config/database';

export class BaseService {
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    protected async executeQuery<T = any>(queryBuilder: any): Promise<T> {
        try {
            return await queryBuilder;
        } catch (error: any) {
            throw new Error(`Database query failed: ${error.message}`);
        }
    }

    protected getQueryBuilder() {
        return db(this.tableName);
    }
}
