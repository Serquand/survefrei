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
import EditSurvey from "./pages/DetailedFormEdition";
import FillForm from "./pages/FillForm";
import ReviewForm from "./pages/ReviewForm";

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
                    path="form/:id/fill"
                    element={
                        <ProtectedRoute allowedRole={[Roles.STUDENT]}>
                            <FillForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="form/:id/review"
                    element={
                        <ProtectedRoute allowedRole={[Roles.STUDENT]}>
                            <ReviewForm />
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
                    path="form/:id/answers"
                    element={
                        <ProtectedRoute allowedRole={[Roles.ADMIN, Roles.TEACHER]}>
                            <FormsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="form/:id/edition"
                    element={
                        <ProtectedRoute allowedRole={[Roles.ADMIN]}>
                            <EditSurvey />
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

// import ScatterPlot from './components/DensityChart';
// import PieChart from './components/PieChart';

// const App = () => {
//     const occurences = [
//         { label: "Bonjour", occurrences: 10 },
//         { label: "Au revoir", occurrences: 5 },
//         { label: "Salut", occurrences: 8 },
//         { label: "Ben dis donc", occurrences: 19 },
//     ]

//     return (
//         <div>
//             <PieChart
//                 questionLabel='Ma question'
//                 responsesOccurence={occurences}
//             />
//             <ScatterPlot />
//         </div>
//     );
// };

// export default App;
