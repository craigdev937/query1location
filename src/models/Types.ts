import { MakeGenerics } from "@tanstack/react-location";

export type Post = {
    id: string,
    title: string,
    body: string
};

export type Posts = {
    posts: Post[]
};

export type LocationGenerics = MakeGenerics<{
    Params: {
        postId: string
    };
}>;



