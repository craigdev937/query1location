import React from "react";
import "./App.css";
// import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { Main } from "../routes/Main";

// const RQClient: QueryClient = new QueryClient();

export const App = (): JSX.Element => {
    return (
        <React.Fragment>
            <Main />
        </React.Fragment>
    );
};



