import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useReducer } from "react";

type UseSecureStateHook<T> = [T | null, (value: T | null) => void]

export function useSecureState<T>(
    key: string,
    initialValue: T | null = null
): UseSecureStateHook<T> {
    const [value, dispatch] = useReducer(
        (_: T | null, action: T | null) => action,
        initialValue
    )

    // Load stored value on mount
    useEffect(() => {
        const load = async () => {
            try {
                const stored = await SecureStore.getItemAsync(key)
                if (stored) {
                    dispatch(JSON.parse(stored))
                }
            } catch (e) {
                console.warn("SecureStore load error:", e)
            }
        }
        load()
    }, [key])

    const setValue = useCallback(
        async (newValue: T | null) => {
            try {
                if (newValue === null) {
                    await SecureStore.deleteItemAsync(key)
                } else {
                    await SecureStore.setItemAsync(key, JSON.stringify(newValue))
                }
                dispatch(newValue)
            } catch (e) {
                console.warn("SecureStore save error:", e)
            }
        },
        [key]
    )

    return [value, setValue]
}
