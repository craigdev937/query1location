import { Post } from "../models/Types";
const URL = "https://jsonplaceholder.typicode.com/posts";

class FetchClass {
    fetchPosts = async (): Promise<Post[]> => {
        const res: Response = await fetch(URL);
        await new Promise((res) => setTimeout(res, 2000));
        if (!res.ok) throw new Error(res.statusText);
        const data: Post[] = await res.json();
        return [...data];
    };

    fetchPostById = async (id: string): Promise<Post> => {
        const res: Response = await fetch(`${URL}/${id}`);
        await new Promise((res) => setTimeout(res, 2000));
        if (!res.ok) throw new Error(res.statusText);
        const data: Post = await res.json();
        return data;
    };
};

export const API: FetchClass = new FetchClass();




