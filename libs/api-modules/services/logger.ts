class Logger {
    info(message: string, ...data: any): void {
        console.log(this.getTimestamp(), 'INFO: ', message, ...data);
    }

    error(message: string, error?: Error): void {
        console.error(this.getTimestamp(), 'ERROR: ', message);
        if (error) {
            console.error(error.stack);
        }
    }

    warn(message: string): void {
        console.warn(this.getTimestamp(), 'WARN: ', message);
    }

    private getTimestamp(): string {
        return new Date().toISOString();
    }
}

export { Logger };
