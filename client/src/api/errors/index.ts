// import {ModelError} from '@modelsjs/model';

export class AuthError extends Error {
    code: string;

    constructor(message: string) {
        super(message || 'No auth');

        this.code = 'NOAUTH';
    }
}

export class AccessError extends Error {
    code: string;

    constructor(message: string) {
        super(message);

        this.code = 'DENIED';
    }
}

export class NotFoundError extends Error {
    code: string;

    constructor(message: string) {
        super(message);

        this.code = 'NOTFOUND';
    }
}