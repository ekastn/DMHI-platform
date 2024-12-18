import { Component } from "solid-js";
import FloatingLayout from "../../components/FloatingLayout"; 

const UserProfile: Component = () => {
    return (
        <FloatingLayout>
            <div class="flex flex-col h-full p-4 bg-white rounded-lg">
            {/* Profile Picture and Username */}
            <div class="flex items-center justify-start space-x-4 bg-gray-50">
                <img
                src="https://via.placeholder.com/150" // Placeholder for profile picture
                alt="Profile"
                class="w-24 h-24 rounded-full border-2 border-gray-300"
                />
                <h1 class="text-2xl font-bold">John Doe</h1>
            </div>
            {/* User Bio */}
            <h1 class="font-xl mt-8 ">Bio : </h1>
            <div class="flex-grow flex mt-4 bg-slate-100">
                <p class="text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident error laborum corrupti atque expedita aspernatur iusto repellat nam velit commodi, reprehenderit, quos itaque quidem nobis harum. Laborum amet laboriosam, praesentium ut inventore perferendis reiciendis provident incidunt asperiores quia vel eveniet quis distinctio autem quibusdam vero ipsam fuga doloribus repellat! Fuga.</p>
            </div>
            {/* Chat Button */}
            <div class="flex justify-end w-full mt-4">
                <button class="px-4 py-2 bg-primary text-white rounded-lg shadow-md">
                Chat
                </button>
            </div>
            </div>
        </FloatingLayout>
    );
};

export default UserProfile;
