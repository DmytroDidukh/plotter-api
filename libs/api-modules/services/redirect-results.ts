import { ApiBaseError } from '../errors/base-error';

class RedirectResults {
    constructor(
        public url: string,
        public queryParams?: Record<string, any>,
    ) {}

    toUrl() {
        if (this.queryParams) {
            const query = new URLSearchParams(
                this.queryParams as Record<string, string>,
            ).toString();

            return `${this.url}?${query}`;
        }

        return this.url;
    }
}

class ErrorRedirectResult extends RedirectResults {
    constructor(
        public url: string,
        public innerError: ApiBaseError,
        public queryParams?: Record<string, any>,
    ) {
        super(url, queryParams);
    }
}

export { RedirectResults, ErrorRedirectResult };
