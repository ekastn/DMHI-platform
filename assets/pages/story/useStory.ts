import { createSignal } from "solid-js";

export const useStory = () => {
    const [threads, setThreads] = createSignal<{ id: number; content: string }[]>([]);
    const [newThread, setNewThread] = createSignal("");
    const [error, setError] = createSignal("");
    const [isLoading, setIsLoading] = createSignal(false);
    let nextId = 1; // To keep track of the next thread ID

    const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setNewThread(target.value);
        setError(""); // Clear error on input
    };

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        if (newThread().trim() === "") {
            setError("Thread content cannot be empty.");
            return;
        }
        setIsLoading(true);
        // Simulate an API call to create a new thread
        setTimeout(() => {
            setThreads([...threads(), { id: nextId++, content: newThread() }]);
            setNewThread("");
            setIsLoading(false);
        }, 1000);
    };

    const handleUpdate = (id: number, updatedContent: string) => {
        setThreads(threads().map(thread => 
            thread.id === id ? { ...thread, content: updatedContent } : thread
        ));
    };

    const handleDelete = (id: number) => {
        setThreads(threads().filter(thread => thread.id !== id));
    };

    return {
        threads,
        newThread,
        error,
        isLoading,
        handleInput,
        handleSubmit,
        handleUpdate,
        handleDelete,
        setNewThread, // Expose setNewThread if needed
    };
};
