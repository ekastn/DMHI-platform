import { describe, expect, it, vi } from "vitest";
import { catchError } from "../../assets/utils/common";
import axios from "axios";

vi.mock("axios");

describe("catchError", () => {
    it("should return data when promise resolves", async () => {
        axios.post = vi.fn().mockResolvedValue({ data: "success" });

        const [error, data] = await catchError(axios.post("http://test.com", {}));

        expect(error).toBeUndefined();
        expect(data).toEqual({ data: "success" });
    });

    it("should return error when promise rejects", async () => {
        const mockError = new Error("Network Error");

        axios.post = vi.fn().mockRejectedValue(mockError);

        const [error] = await catchError(axios.post("http://test.com", {}));

        expect(error).toBe(mockError);
    });
});
