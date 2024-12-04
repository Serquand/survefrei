import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Organization } from "../utils/types";

const initialState = {
    organizations: [] as Organization[],
};

export const fetchOrganizations = createAsyncThunk("organization/fetchOrganizations", async (_, { rejectWithValue }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const accessToken = import.meta.env.VITE_ACCESS_TOKEN_ADMIN;
    const headers = { Authorization: "Bearer " + accessToken };

    try {
        const response = await fetch(API_URL + "/organization", { headers });
        if (!response.ok) {
            throw new Error("Failed to fetch organizations");
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
}
);

const organizationSlice = createSlice({
    name: "organization",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchOrganizations.fulfilled, (state, action) => {
            state.organizations = action.payload;
        })
    },
});

export default organizationSlice.reducer;
