import axios from "axios";
import { catchError } from "../utils/common";
import { APIResponseType } from "../types/api";

export const loginUser = async (username: string, password: string) => {
    const [error, res] = await catchError(
        axios.post<APIResponseType<any>>("/auth/login", { username, password })
    );
    if (error) {
        console.log(error);
    }
    return res?.data;
};

export const registerUser = async (username: string, password: string) => {
    const [error, res] = await catchError(
        axios.post<APIResponseType<any>>("/auth/register", { username, password })
    );
    if (error) {
        console.log(error);
    }
    return res?.data;
};

export const logoutUser = async () => {
    const [error, res] = await catchError(axios.get<APIResponseType<null>>("/auth/logout"));
    if (error) {
        console.log(error);
    }
    return res;
};
