import { useState, useEffect } from "react";
import { User } from "../utils/types";
import InputField from "./SiteGlobalInput";
import SiteSelect from "./SiteSelect";
import { useSelector } from "react-redux";

export type CreateNewUSer = Omit<User, "accessToken"> & { password?: string; };

interface ModalUserProps {
    isOpen: boolean;
    onClose: () => void;
    user: Partial<CreateNewUSer>;
    onUpdateUser: (updatedUser: Omit<User, "accessToken">) => void;
    mode: 'creation' | 'edition';
}

const ModalUser = ({ isOpen, onClose, user, onUpdateUser, mode }: ModalUserProps) => {
    const [formData, setFormData] = useState<Partial<CreateNewUSer>>(user);
    const API_URL = import.meta.env.VITE_API_URL;
    const userLoggedIn = useSelector((state: any) => state.user.user) as User;
    const accessToken = userLoggedIn.accessToken;
    const roleOptions: { label: string; id: string }[] = [
        { id: 'student', label: "Étudiant" },
        { id: 'teacher', label: 'Professeur' },
        { id: 'admin', label: 'Administrateur' },
    ]


    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleChange = (key: keyof CreateNewUSer, e: any) => {
        setFormData({ ...formData, [key]: e });
    };

    const sendUserRequest = async (url: string, method: string, data: object) => {
        try {
            const requestOptions = {
                body: JSON.stringify(data),
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
            };

            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("An error occurred:", error);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (mode === "creation") {
                const { id, ...dataToSend } = formData;
                const data = await sendUserRequest(`${API_URL}/user/register`, "POST", dataToSend);
                onUpdateUser(data);
            } else if (mode === "edition") {
                const { id, password, email, ...dataToSend } = formData;
                await sendUserRequest(`${API_URL}/user/${id}`, "PUT", dataToSend);
                onUpdateUser(formData);
            }
        } catch (error) {
            console.error("Error during submission:", error);
        }
    };


    return (
        <>
            {isOpen && (
                <div className="fixed w-screen inset-0 bg-gray-900/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                                { mode === 'creation' ? 'Créer un nouvel utilisateur' : 'Modifier l\'utilisateur' }
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="mt-4">
                            <form
                                onSubmit={handleSubmit}
                                className="grid grid-cols-2 gap-y-4 gap-x-12"
                            >
                                <InputField
                                    id="update-user-first-name"
                                    modelValue={formData.firstName}
                                    onUpdate={(e) => handleChange('firstName', e)}
                                    label="Prénom"
                                    placeholder="Prénom"
                                    required={true}
                                />

                                <InputField
                                    id="update-user-last-name"
                                    modelValue={formData.lastName}
                                    onUpdate={(e) => handleChange('lastName', e)}
                                    label="Nom"
                                    placeholder="Nom"
                                    required={true}
                                />

                                <InputField
                                    id="update-user-email"
                                    modelValue={formData.email}
                                    onUpdate={(e) => handleChange('email', e)}
                                    label="Adresse email"
                                    placeholder="Adresse email"
                                    required={true}
                                    disabled={mode === 'edition'}
                                />

                                <SiteSelect
                                    modelValue={formData.role}
                                    onUpdate={(e) => handleChange("role", e)}
                                    options={roleOptions}
                                    label="Rôle"
                                    placeholder="Rôle"
                                    required={true}
                                    optionLabel="label"
                                    optionKey="id"
                                />

                                {mode === 'creation' ? <InputField
                                    id="update-user-password"
                                    modelValue={formData.password}
                                    onUpdate={(e) => handleChange('password', e)}
                                    label="Mot de passe"
                                    placeholder="Mot de passe"
                                    required={true}
                                    type="password"
                                /> : null}

                                <div className="flex justify-end space-x-2 col-span-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        { mode === 'creation' ? 'Créer' : 'Mettre à jour' }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalUser;
