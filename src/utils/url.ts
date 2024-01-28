class URLUtils {
    private static urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    static validateURL(value: string): boolean {
        return this.urlRegex.test(value);
    }
}

export { URLUtils };
