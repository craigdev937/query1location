import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { Router, useLoadRoute, Link, ReactLocation, 
    MatchRoute, Outlet, useMatch } from "@tanstack/react-location";
import { useQuery, useQueryClient } from "react-query";
import { Post, LocationGenerics } from "../models/Types";

const RQClient = new QueryClient();
const location = new ReactLocation<LocationGenerics>();

export const Main = (): JSX.Element => {
    return (
    <React.Fragment>
        <QueryClientProvider client={RQClient}>
        <Router 
            location={location}
            routes={[
                {
                    path: "/",
                    element: "Welcome Home!"
                },
                {
                    path: "posts",
                    element: <Posts />,
                    loader: () => 
                        RQClient.getQueryData(["posts"]) ??
                        RQClient.fetchQuery(["posts"], fetchPosts)
                            .then(() => ({})),
                    children: [
                        { path: "/", element: "Select a post." },
                        {
                            post: ":postId",
                            element: <Post />,
                            loader: ({ params: { postId } }) => 
                                RQClient.getQueryData(["posts", postId]) ??
                                RQClient.fetchQuery(["posts", postId], () => 
                                    fetchPostById(postId)),
                        },
                    ],
                },
            ]}
        >
            <aside><h1>Basic With Rect Query</h1>
                <hr />
                <h3>
                    <Link to=".">Home</Link>{" "}
                    <Link to="posts" preload={1}>
                        Posts
                    </Link>
                </h3>
                <Outlet />
            </aside>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.Fragment>
    );
};

function usePosts() {
    return useQuery<Post[], any>("posts", fetchPosts);
};

function Posts() {
    const queryClient = useQueryClient();
    const { status, isFetching, error, data } = usePosts();
    const loadRoute = useLoadRoute();

    return (
        <React.Fragment>
            <h2>Posts {isFetching ? "..." : ""}</h2>
            <main>
                {status === "loading" ? (
                    "Loading..."
                ) : status === "error" ? (
                    <span>Error: {error.message}</span>
                ) : (
                    <section>
                        <aside 
                            style={{ display: "flex", flexWrap: "wrap" }}
                            >
                                <div style={{ flex: "0 0 200px" }}>
                                    {data?.map((post) => (
                                        <p key={post.id}>
                                            <Link
                                                to={`./${post.id}`}
                                                onMouseEnter={() => loadRoute({ to: post.id })}
                                                style={
                                                    // We can access the query data here to show bold links for
                                                    // ones that are cached
                                                    queryClient.getQueryData(["posts", `${post.id}`])
                                                        ? {
                                                            fontWeight: "bold",
                                                            color: "green",
                                                            }
                                                        : {}
                                                }
                                                >{post.title}{" "}
                                                <MatchRoute to={post.id} pending>
                                                    ...
                                                </MatchRoute>
                                            </Link>
                                        </p>
                                    ))}
                                </div>
                                <div style={{ flex: "1 1" }}>
                                    <Outlet />
                                </div>
                        </aside>
                    </section>
                )}
            </main>
        </React.Fragment>
    );
};

function usePost(postId: string) {
    return useQuery<Post, any>(["posts", postId], 
    () => fetchPostById(postId), {
        enabled: !!postId,
    });
};

function Post() {
    const { 
        params: { postId },
     } = useMatch();

     const { error, isFetching, status, data } = usePost(postId);

     return (
         <React.Fragment>
             <aside><Link to="..">Back</Link></aside>
             {!postId || status === "loading" ? (
                 "Loading..."
             ) : status === "error" ? (
                 <span>Error: {error.message}</span>
             ) : (
                 <aside>
                     <h1>
                         {data?.title} {isFetching ? "..." : " "}
                     </h1>
                     <div><p>{data?.body}</p></div>
                 </aside>
             )}
         </React.Fragment>
     );
};

const URL = "https://jsonplaceholder.typicode.com/posts";

const fetchPosts = async (): Promise<Post[]> => {
    const res: Response = await fetch(URL);
    await new Promise((res) => setTimeout(res, 2000));
    if (!res.ok) throw new Error(res.statusText);
    const data: Post[] = await res.json();
    return [...data];
};

const fetchPostById = async (id: string): Promise<Post> => {
    await new Promise((res) => setTimeout(res, 2000));
    const res: Response = await fetch(URL + "/" + id);
    if (!res.ok) throw new Error(res.statusText);
    const data: Post = await res.json();
    return data;
};


