export class Exception extends Error {
    message: string;
    status: number;
    constructor(error: string, statusCode: number) {
        super(error);
        
        this.message = error;
        this.status = statusCode;
    }
}

export default Exception