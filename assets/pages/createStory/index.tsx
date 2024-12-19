import { FaSolidPen } from "solid-icons/fa"; import { Component, Show } from "solid-js"; import { useCreateStory } from "./useCreateStory"; import { BiRegularErrorCircle } from "solid-icons/bi"; import { AiFillEdit } from "solid-icons/ai"; import FloatingLayout from "../../components/FloatingLayout";

const CreateStory: Component = () => { const { isLoading, handleInput, handleSubmit, error } = useCreateStory();

return (
    <FloatingLayout>
        <div class="inset-0 flex items-center justify-center z-0 bg-white ">
            <div class="inherit rounded-lg p-8 w-full h-full ">
                <h1 class="text-2xl text-center mb-4">Create a Story</h1>
                <br />       
                <h2 class="text-2xl mb-4">Title :</h2>
                <form onSubmit={handleSubmit} class="space-y-6">
                    <Show when={error()}>
                        <div role="alert" class="alert">
                            <BiRegularErrorCircle />
                            <span>{error()}</span>
                        </div>
                    </Show>
                    <label class="input input-lg input-bordered flex items-center gap-4 ">
                        <FaSolidPen />
                        <input
                            onInput={handleInput}
                            name="tittle"
                            placeholder="What the title of your story?"
                            type="text"
                            class="grow"
                            required
                        />
                    </label>

                    <h2 class="text-2xl mb-2">What's On Your Mind?</h2>
                    <label class="flex items-center gap-4 h-52 justify-center">
                        <textarea
                            onInput={handleInput}
                            name="content"
                            placeholder="Write your story here..."
                            class="input grow resize-none overflow-auto h-full rounded-sm bg-inherit textarea border border-gray-300 rounded-xl" 
                            required
                        />
                    </label>

                    <div class="flex justify-between">
                        <button
                            type="submit"
                            disabled={isLoading()}
                            class="btn btn-lg btn-neutral w-1/2 rounded-full mr-2"
                        >
                            {!isLoading() ? (
                                "Create Story"
                            ) : (
                                <span class="loading loading-spinner loading-md"></span>
                            )}
                        </button>

                        <button 
                            class="btn btn-lg btn-outline rounded-full w-1/2 ml-2"
                            onClick={() => window.location.href = '/'}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </FloatingLayout>
);

};

export default CreateStory;