import { createSlice } from "@reduxjs/toolkit";
import { Organization } from "../utils/types";

const initialState: { organizations: Organization[] | null } = {
    organizations: [
        {
            id: 8,
            name: "Mon organisation 9",
            users: []
        }
    ],
};

const organizationSlice = createSlice({
    name: "organization",
    initialState,
    reducers: {
        fetchOrganizations: (state, accessToken) => {
            const API_URL = import.meta.env.VITE_API_URL;
            const headers = { Authorization: 'Bearer ' + accessToken };
            fetch(API_URL + '/organization', { headers })
                .then(response => response.json())
                .then(data => state.organizations = data);
        }
    },
});

export default organizationSlice.reducer;
export const { fetchOrganizations } = organizationSlice.actions;