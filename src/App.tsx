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

// import { useState } from 'react';
// import SiteGlobalInput from './components/SiteGlobalInput';
// import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

// const App: React.FC = () => {
//     const [value, setValue] = useState<string | number | boolean | string[] | undefined>('');

//     const handleUpdate = (newValue: string | number | boolean | string[] | undefined) => {
//         setValue(newValue);
//     };

//     return (
//         <div className="p-4">
//             <SiteGlobalInput
//                 id="example-input"
//                 type="text"
//                 modelValue={value}
//                 label="Enter your text"
//                 placeholder="Type something..."
//                 hasIcon={true}
//                 required={true}
//                 maxLength={50}
//                 onUpdate={handleUpdate}
//             >
//                 <ExclamationCircleIcon className='size-6 text-red-600' />
//             </SiteGlobalInput>
//             <p className="mt-4">Current Value: {value}</p>
//         </div>
//     );
// };

// export default App;