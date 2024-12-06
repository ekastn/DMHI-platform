import { ParentComponent } from "solid-js";

import Experience from "./components/Experience";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

const App: ParentComponent = (props) => {
    return (
        <AuthProvider>
            <div class="w-screen h-screen overflow-hidden">
                <Navbar />
                <div class="absolute inset-0 w-screen h-screen overflow-hidden vx-radial -z-50" />
                <main class="w-screen h-screen">
                    <Experience />
                    {props.children}
                </main>
            </div>
        </AuthProvider>
    );
};

export default App;
