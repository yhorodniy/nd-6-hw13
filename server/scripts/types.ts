export interface NewsPost {
    id?: number;
    title: string;
    text: string;
    created_date: Date;
}

export interface Video {
    id?: number;
    title: string;
    views: number;
    category: string;
}

export interface NewsPostCreateData {
    title: string;
    text: string;
    created_date: Date;
}

export interface NewsPostUpdateData {
    title?: string;
    text?: string;
}

export interface CommandLineArgs {
    [key: string]: string | undefined;
}

export function parseArgs(argv: string[]): CommandLineArgs {
    const args: CommandLineArgs = {};
    
    argv.forEach(arg => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.split('=');
            const fieldName = key.replace('--', '');
            if (value) {
                args[fieldName] = value.replace(/['"]/g, '').trim();
            }
        }
    });
    
    return args;
}

export function validateId(idString: string): number | null {
    const id = parseInt(idString);
    return isNaN(id) ? null : id;
}
