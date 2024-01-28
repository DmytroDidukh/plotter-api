import { body, ValidationChain } from 'express-validator';

export class Validator {
    static createNotAllowedBodySchema(allowedFields: string[]): ValidationChain[] {
        return [
            body()
                .bail()
                .custom((value, { req }) => {
                    const allowedKeys = allowedFields;
                    const actualKeys = Object.keys(req.body);
                    const extraKeys = actualKeys.filter((key) => !allowedKeys.includes(key));

                    if (extraKeys.length > 0) {
                        throw new Error(`[${extraKeys.join(', ')}] are not allowed.`);
                    }

                    return true;
                }),
        ];
    }
}
