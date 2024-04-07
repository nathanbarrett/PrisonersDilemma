
export function truncate(str: string, length: number, suffix = "..."): string {
    if (str.length <= length) {
        return str;
    }
    return `${str.slice(0, length - suffix.length)}${suffix}`;
}
