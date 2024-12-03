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
import FillForm from "./pages/FillForm";
import ReviewForm from "./pages/ReviewForm";
import AnswersPage from "./pages/AnswersPage";
import FormEditionPage from "./pages/FormEditionPage";

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
                            <AnswersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="form/:id/edition"
                    element={
                        <ProtectedRoute allowedRole={[Roles.ADMIN]}>
                            <FormEditionPage />
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

// // import ScatterPlot from './components/DensityChart';
// // import PieChart from './components/PieChart';

// // const App = () => {a
// //     const occurences = [
// //         { label: "Bonjour", occurrences: 10 },
// //         { label: "Au revoir", occurrences: 5 },
// //         { label: "Salut", occurrences: 8 },
// //         { label: "Ben dis donc", occurrences: 19 },
// //     ]

// //     return (
// //         <div>
// //             <PieChart
// //                 questionLabel='Ma question'
// //                 responsesOccurence={occurences}
// //             />
// //             <ScatterPlot />
// //         </div>
// //     );
// // };

// // export default App;


// const App = () => <Statistic
//         title="Total subscribers"
//         value="71,897"
//     >
//     <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
//         <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
//     </svg>
// </Statistic>

// export default App;