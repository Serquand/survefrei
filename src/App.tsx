import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/DefaultLayout";
import Login from "./pages/Login";
import ToFill from "./pages/ToFill";
import Filled from "./pages/Filled";
import OrganizationPage from "./pages/Organization";
import FormsPage from "./pages/Forms";
import UsersPage from "./pages/UsersPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/ProtectedRoute";
import { Roles } from "./utils/types";
import DetailedForm from "./pages/DetailedForm";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/" element={<Layout />}>
                {/* Routes protégées */}
                <Route
                    path="to-fill"
                    element={
                        <ProtectedRoute allowedRole={[Roles.STUDENT]}>
                            <ToFill />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="filled"
                    element={
                        <ProtectedRoute allowedRole={[Roles.STUDENT]}>
                            <Filled />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="organization"
                    element={
                        <ProtectedRoute allowedRole={[Roles.ADMIN]}>
                            <OrganizationPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="forms"
                    element={
                        <ProtectedRoute allowedRole={[Roles.ADMIN, Roles.TEACHER]}>
                            <FormsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="form/:id"
                    element={
                        <ProtectedRoute allowedRole={[Roles.ADMIN]}>
                            <DetailedForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="users"
                    element={
                        <ProtectedRoute allowedRole={[Roles.ADMIN]}>
                            <UsersPage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Page 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;