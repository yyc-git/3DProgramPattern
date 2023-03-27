export function curry2<T, K, R>(func: (param1: T, param2: K) => R) {
    return (param1: T) => {
        return (param2: K) => {
            return func(param1, param2)
        }
    }
}

export function curry3_1<T, K, I, R>(func: (param1: T, param2: K, param3: I) => R) {
    return (param1: T) => {
        return (param2: K, param3: I) => {
            return func(param1, param2, param3)
        }
    }
}

export function curry3_2<T, K, I, R>(func: (param1: T, param2: K, param3: I) => R) {
    return (param1: T, param2: K) => {
        return (param3: I) => {
            return func(param1, param2, param3)
        }
    }
}