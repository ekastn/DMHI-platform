import { A } from "@solidjs/router";
import { FaSolidPen, FaSolidComments, FaSolidTrash  } from "solid-icons/fa";
import { BiSolidEditAlt } from 'solid-icons/bi'
import { Component, Show } from "solid-js";
import { BiRegularErrorCircle } from "solid-icons/bi";
import { useStory } from "./useStory"; // Import the custom hook

const StoryThreads: Component = () => {
    const {
        threads,
        newThread,
        error,
        isLoading,
        handleInput,
        handleSubmit,
        handleUpdate,
        handleDelete,
    } = useStory(); // Destructure the hook

    return (
        <div class="absolute flex items-center justify-center w-screen h-screen inset-0 backdrop-blur-lg">
            <div class="flex-1 flex items-center justify-center px-4">
                <div class="space-y-8">
                    <h2 class="text-3xl text-center">Story Threads</h2>

                    <form onSubmit={handleSubmit} class="mt-8 space-y-6">
                        <Show when={error()}>
                            <div role="alert" class="alert">
                                <BiRegularErrorCircle />
                                <span>{error()}</span>
                            </div>
                        </Show>
                        <label class="input input-lg input-bordered flex items-center gap-4 bg-transparent">
                            <FaSolidPen />
                            <input
                                onInput={handleInput}
                                value={newThread()}
                                type="text"
                                class="grow"
                                placeholder="Create a new thread"
                                required
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={isLoading()}
                            class="btn btn-lg btn-neutral w-full rounded-full"
                        >
                            {!isLoading() ? (
                                "Post Thread"
                            ) : (
                                <span class="loading loading-spinner loading-md"></span>
                            )}
                        </button>
                    </form>

                    <div class="space-y-4">
                        <h3 class="text-2xl text-center">Existing Threads</h3>
                        <ul class="space-y-2">
                            {threads().map((thread) => (
                                <li class="flex items-center gap-2 p-4 border rounded-lg">
                                    <FaSolidComments />
                                    <span>{thread.content}</span>
                                    <div class="flex gap-2 ml-auto">
                                        <button
                                            onClick={() => {
                                                const updatedContent = prompt("Update thread content:", thread.content);
                                                if (updatedContent) {
                                                    handleUpdate(thread.id, updatedContent);
                                                }
                                            }}
                                            class="text-blue-500 hover:underline"
                                        >
                                            <BiSolidEditAlt />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(thread.id)}
                                            class="text-red-500 hover:underline"
                                        >
                                            <FaSolidTrash />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p class="text-center text-gray-400">
                        Want to join a discussion?
                        <A href="/discussions" class="underline underline-offset-2 text-gray-800">
                            Check out the discussions here
                        </A>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StoryThreads;
