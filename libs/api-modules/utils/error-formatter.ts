class ErrorFormatter {
    static formatErrorsToMessage(initialMessage: string, errors: string[]): string {
        let message = initialMessage;

        if (errors.length === 1) {
            message += ` ${errors[0]}`;
        } else {
            errors.forEach((error, index) => {
                message += `\n${index + 1}. ${error}`;
            });
        }

        return message;
    }
}

export { ErrorFormatter };
