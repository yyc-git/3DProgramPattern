export function getExnFromStrictUndefined<T>(nullableValue: T | undefined): T {
    if (nullableValue === undefined) {
        throw new Error("nullableValue should exist")
    }

    return nullableValue as T
}

export function getExnFromStrictNull<T>(nullableValue: T | null): T {
    if (nullableValue === null) {
        throw new Error("nullableValue should exist")
    }

    return nullableValue as T
}
