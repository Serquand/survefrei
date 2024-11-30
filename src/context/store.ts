import { configureStore } from "@reduxjs/toolkit";
import userReducers from "./User";

export const store = configureStore({
    reducer: {
        general: userReducers,
    },
});