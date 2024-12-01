import { configureStore } from "@reduxjs/toolkit";
import user from "./User";
import organization from './Organization';

export const store = configureStore({
    reducer: { user, organization },
});