import { get } from "../apiMethod";

interface SearchResponse {
    query: string;
    results: {
        answer: string;
        source_files: {
            source: string;
            pages: string;
        }[];
        prompt: string;
    };
}
interface SearchResponseError {
    error: string;
}

export const sendMessage = async (query: string) : Promise<SearchResponse | SearchResponseError> => {
    if (query.trim() === "") return {
        error: "Query cannot be empty"
    };

    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            return {
                error: "User not authenticated"
            };
        }
        const response = await get('search/', {
            query,
        }, token);
        return response as SearchResponse;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}

