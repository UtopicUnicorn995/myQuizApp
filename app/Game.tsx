import { useSession } from "@/src/context/ctx";
import quizData from '@/src/data/quizzes_custom_1000_unique.json';
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Game() {
    const { userScore, addScore, doneQuestions, addDoneQuestion, resetSession } = useSession();

    const [category, setCategory] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(10);

    const categories = [...new Set(quizData.map((q) => q.topic))];

    console.log('categorries', categories, categories.length)

    const getRandomQuestion = useCallback(() => {
        const available = quizData.filter(
            (q) => q.topic === category && !doneQuestions.has(q.id)
        );


        if (available.length === 0) {
            setCurrentQuestion(null);
            return;
        }
        const randomQ = available[Math.floor(Math.random() * available.length)];
        console.log("Avail", doneQuestions, available);
        setCurrentQuestion(randomQ);
        setTimeLeft(10);
    }, [category, doneQuestions]);

    console.log('current quest', currentQuestion?.id)
    // Start timer
    useEffect(() => {
        if (!currentQuestion) return;

        if (timeLeft === 0) {
            addDoneQuestion(currentQuestion.id);
        }

        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, currentQuestion]);

    // When doneQuestions updates, get a new question
    useEffect(() => {
        if (category && currentQuestion && doneQuestions.has(currentQuestion.id)) {
            getRandomQuestion();
        }
    }, [doneQuestions, category]);

    useEffect(() => {
        if (category) {
            getRandomQuestion();
        }
    }, [category]);

    const handleAnswer = (option: string) => {
        if (!currentQuestion) return;
        if (option === currentQuestion.answer) {
            addDoneQuestion(currentQuestion.id);
            addScore();
        }
        getRandomQuestion();
    };

    // If no category chosen, show category picker
    if (!category) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Choose a Category</Text>
                <TouchableOpacity style={styles.resetButton} onPress={resetSession}>
                    <Text style={styles.resetText}>🔄 Reset Game</Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={styles.categoryButton}
                        onPress={() => {
                            setCategory(cat);
                        }}
                    >
                        <Text style={styles.categoryText}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }

    // No questions left
    if (!currentQuestion) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No more questions in {category} 🎉</Text>
                <Text style={styles.score}>Your Score: {userScore}</Text>
                <TouchableOpacity style={styles.resetButton} onPress={() => setCategory(null)}>
                    <Text style={styles.resetText}>Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Question UI
    return (
        <View style={styles.container}>
            <Text style={styles.score}>Score: {userScore}</Text>
            <Text style={styles.timer}>⏱ {timeLeft}s</Text>

            <Text style={styles.question}>{currentQuestion.question}</Text>

            {currentQuestion.options.map((opt: string) => (
                <TouchableOpacity
                    key={opt}
                    style={styles.optionButton}
                    onPress={() => handleAnswer(opt)}
                >
                    <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.resetButton} onPress={() => setCategory(null)}>
                <Text style={styles.resetText}>Go back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    score: { fontSize: 18, marginBottom: 10 },
    timer: { fontSize: 18, color: "red", marginBottom: 20 },
    question: { fontSize: 20, marginBottom: 20 },
    optionButton: {
        padding: 15,
        backgroundColor: "#eee",
        borderRadius: 8,
        marginBottom: 10,
    },
    optionText: { fontSize: 16 },
    categoryButton: {
        padding: 15,
        backgroundColor: "#4a90e2",
        borderRadius: 8,
        marginBottom: 10,
    },
    categoryText: { fontSize: 18, color: "white" },
    resetButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: "#e74c3c", // red
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3, // Android shadow
        marginBottom: 20
    },
    resetText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        textTransform: "uppercase",
    },

});
