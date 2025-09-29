import {
    createContext,
    type PropsWithChildren,
    useContext,
    useMemo,
} from "react";
import { useSecureState } from "../hooks/useStorageState";

type SessionContextType = {
    userScore: number;
    addScore: () => void;
    clearScore: () => void;
    doneQuestions: Set<number>;
    addDoneQuestion: (id: number) => void;
    resetSession: () => void; // 👈 expose reset
};

const AppContext = createContext<SessionContextType | undefined>(undefined);

export function useSession() {
    const value = useContext(AppContext);

    if (!value) {
        throw new Error("User session must be wrapped in a <SessionProvider/>");
    }

    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [userScore, setUserScore] = useSecureState("session", 0);
    const [doneQuestionsArray, setDoneQuestions] = useSecureState<number[]>(
        "doneQuestions",
        []
    );

    const doneQuestions = useMemo(
        () => new Set(doneQuestionsArray),
        [doneQuestionsArray]
    );

    const addDoneQuestion = (id: number) =>
        setDoneQuestions([...(doneQuestionsArray ?? []), id].filter(
            (v, i, arr) => arr.indexOf(v) === i
        ));

    const addScore = () => setUserScore((userScore ?? 0) + 1);

    const clearScore = () => setUserScore(0);

    const resetSession = () => {
        setUserScore(0);
        setDoneQuestions([]); // 👈 reset as array (since your hook expects an array)
    };

    return (
        <AppContext.Provider
            value={{
                userScore: userScore ?? 0,
                addScore,
                clearScore,
                doneQuestions,
                addDoneQuestion,
                resetSession, // 👈 include here
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
