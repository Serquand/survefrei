import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/DefaultLayout";
import Login from "./pages/Login";
import ToFill from "./pages/ToFill";
import Filled from "./pages/Filled";
import OrganizationPage from "./pages/Organization";
import FormsPage from "./pages/Forms";
import UsersPage from "./pages/UsersPage";
import NotFound from "./pages/NotFound";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/app" element={<Layout />}>
                <Route path="to-fill" element={<ToFill />} />
                <Route path="filled" element={<Filled />} />
                <Route path="organization" element={<OrganizationPage />} />
                <Route path="forms" element={<FormsPage />} />
                <Route path="users" element={<UsersPage />} />
            </Route>

            <Route path="*" element={ <NotFound /> } />
        </Routes>
    );
};

export default App;
