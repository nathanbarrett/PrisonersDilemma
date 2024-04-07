
import isEmail from "validator/es/lib/isEmail";


export type ValidationResult = string | boolean;
export type ValidationRule = ValidationResult | PromiseLike<ValidationResult> | ((value: unknown) => ValidationResult) | ((value: unknown) => PromiseLike<ValidationResult>);
export type ValidationRuleGenerator = (value?: unknown) => ValidationRule;
export type FormRule = ValidationRule | ValidationRuleGenerator;
export interface FormRules {
    [key: string]: ValidationRuleGenerator;
}

export const formRules = {
    required: (msg?: string) => {
        return (value: unknown) => {
            return !!value || msg || 'Required';
        }
    },
    email: (msg?: string) => {
        return (value: unknown) => {
            return isEmail(typeof value === 'string' ? value : '') || msg || 'Invalid email';
        }
    },
    min: (min: number) => {
        return (value: unknown) => {
            if (typeof value === 'string') {
                return value.length >= min || `Must be at least ${min} characters`
            }
            if (typeof value === 'number') {
                return value >= min || `Must be at least ${min}`
            }
            return true;
        }
    },
    max: (max: number) => {
        return (value: unknown) => {
            if (typeof value === 'string') {
                return value.length <= max || `Must be at most ${max} characters`
            }
            if (typeof value === 'number') {
                return value <= max || `Must be at most ${max}`
            }
            return true;
        }
    },
    equals: (other: unknown, msg?: string) => {
        return (value: unknown) => {
            const otherValue = typeof other === 'function' ? other() : other;
            return value === otherValue || msg || `Must be equal to ${otherValue}`
        }
    }
} satisfies FormRules;
