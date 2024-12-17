import { AiFillEdit } from "solid-icons/ai";
import { FaSolidPen } from "solid-icons/fa";
import { Component } from "solid-js";
import { useViewStory } from "./useStory";
import axios from "axios";
import FloatingLayout from "../../components/FloatingLayout";

const ViewStory: Component = () => {
    const { isEditing, story, setIsEditing, handleInput, fields, handleUpdate, handleDelete } = useViewStory();

    const onSubmit = async (e: Event) => {
        e.preventDefault();
        await handleUpdate();
    };

    const onDelete = async (e: Event) => {
        e.preventDefault();
        await handleDelete();
    }



    return (
        <FloatingLayout>
                {isEditing() ? (
                    <form onSubmit={onSubmit} class="space-y-6">
                        <h1 class="text-2xl text-center mb-4">Edit Story</h1>
                        <p class="text-xl ">Tittle :</p>
                        <label class="input input-lg input-bordered flex items-center gap-4">
                            <FaSolidPen />
                            <input
                                onInput={handleInput}
                                id="title"
                                name="title"
                                type="text"
                                class="grow"
                                value={fields.title}
                                required
                            />
                        </label>

                        <p class="text-xl ">Content :</p>
                        <label class="input input-lg input-bordered flex items-center gap-4 h-96 ">
                            <AiFillEdit />
                            <textarea
                                onInput={handleInput}
                                id="content"
                                name="content"
                                class="h-80 w-full rounded-sm bg-inherit resize-none border-none"
                                rows="4"
                                value={fields.content}
                                required
                            />
                        </label>

                        <div class="flex justify-end space-x-4">
                            <button type="submit" class="btn btn-info text-white">
                                Save
                            </button>
                            <button type="button" onClick={onDelete} class="btn btn-error">
                                Delete
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                class="btn btn-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div class="space-y-4 mt-4 p-12">
                        <div class="">
                            <div class="flex justify-between items-center">
                                <h1 class="text-3xl ml-4">{story.title}</h1>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    class="flex items-center gap-2 mr-12 mt-4 text-sm text-gray-500"
                                >
                                    <AiFillEdit />
                                    Edit
                                </button>
                            </div>
                            <p class="text-sm text-gray-500 mt-4 ml-4">Author: {story.user}</p>
                        </div>

                        <div class="p-4 font-thin rounded-md ">
                            <p class="text-lg">{story.content}</p>
                        </div>
                    </div>
                )}
        </FloatingLayout>
    );
};

export default ViewStory;
