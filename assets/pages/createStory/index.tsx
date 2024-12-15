import { FaSolidPen} from "solid-icons/fa";
import { Component, Show } from "solid-js";
import { useCreateStory } from "./useCreateStory";
import { BiRegularErrorCircle } from "solid-icons/bi";
import { AiFillEdit } from 'solid-icons/ai'

const CreateStory: Component = () => {
    const { isLoading, handleInput, handleSubmit, error } = useCreateStory();

    return (
        <div class="fixed inset-0 flex items-center justify-center z-0">
            <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 class="text-2xl text-center mb-4">Create a Story</h2>

                <form onSubmit={handleSubmit} class="space-y-6">
                    <Show when={error()}>
                        <div role="alert" class="alert">
                            <BiRegularErrorCircle />
                            <span>{error()}</span>
                        </div>
                    </Show>

                    <label class="input input-lg input-bordered flex items-center gap-4">
                        <FaSolidPen />
                        <input
                            onInput={handleInput}
                            name="tittle"
                            type="text"
                            class="grow"
                            placeholder="Story Title"
                            required
                        />
                    </label>

                    <label class="input input-lg input-bordered flex items-center gap-4">
                        <AiFillEdit />
                        <input
                            onInput={handleInput}
                            name="content"
                            type="text"
                            class="grow"
                            placeholder="Story Content"
                            required
                        />
                    </label>

                    <label class="input input-lg input-bordered flex items-center gap-4">
                        <AiFillEdit />
                        <input
                            onInput={handleInput}
                            name="latitude"
                            type="number"
                            class="grow"
                            placeholder="Latitude"
                            required
                        />
                    </label>

                    <label class="input input-lg input-bordered flex items-center gap-4">
                        <AiFillEdit />
                        <input
                            onInput={handleInput}
                            name="longitude"
                            type="number"
                            class="grow"
                            placeholder="Longitude"
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isLoading()}
                        class="btn btn-lg btn-neutral w-full rounded-full"
                    >
                        {!isLoading() ? (
                            "Create Story"
                        ) : (
                            <span class="loading loading-spinner loading-md"></span>
                        )}
                    </button>
                </form>

                <button
                    class="btn btn-lg btn-outline rounded-full w-full mt-4"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CreateStory;
