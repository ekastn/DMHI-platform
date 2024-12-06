import { useNavigate } from "@solidjs/router";
import { createContext, createSignal, onMount, Show, useContext } from "solid-js";
import { ParentComponent } from "solid-js/types/server/rendering.js";
import { checkAuthApi, loginApi, logoutApi, registerApi } from "../services/authService";
import { UserType } from "../types/user.";

type AuthContextType = {
    user: UserType | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoggedIn: () => boolean;
};

const AuthContext = createContext<AuthContextType>();

export const AuthProvider: ParentComponent = (props) => {
    const [user, setUser] = createSignal<UserType | null>(null);
    const [isReady, setIsReady] = createSignal(false);

    const navigate = useNavigate();

    onMount(() => {
        const localUser = localStorage.getItem("user");
        if (localUser) {
            setUser(JSON.parse(localUser));
        } else {
            checkAuthApi().then((res) => {
                if (res?.success && res.data?.user) {
                    setUser(res.data.user);
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                }
            });
        }
        setIsReady(true);
    });

    const login = async (username: string, password: string) => {
        const res = await loginApi(username, password);
        if (res.success) {
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/");
        }
    };

    const register = async (username: string, password: string) => {
        const res = await registerApi(username, password);
        if (res.success) {
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/");
        }
    };

    const logout = async () => {
        await logoutApi();
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    const isLoggedIn = () => {
        return !!user();
    };

    return (
        <AuthContext.Provider value={{ user: user(), login, register, logout, isLoggedIn }}>
            <Show when={isReady()}>{props.children}</Show>
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error("Missing context Provider");
    }
    return value;
};
