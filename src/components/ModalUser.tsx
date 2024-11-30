import { useState, useEffect } from "react";
import { User } from "../utils/types";
import SiteInput from "./SiteInput";

interface ModalUserProps {
    isOpen: boolean;
    onClose: () => void;
    user: Omit<User, "accessToken">;
    onUpdateUser: (updatedUser: Omit<User, "accessToken">) => void;
}

const ModalUser = ({ isOpen, onClose, user, onUpdateUser }: ModalUserProps) => {
    const [formData, setFormData] = useState<Omit<User, "accessToken">>(user);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(formData);
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser(formData);
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div className="fixed w-screen inset-0 bg-gray-900/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Modifier l'utilisateur</h3>
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
                                <div className="mb-4">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        Prénom
                                    </label>
                                    <SiteInput
                                        onChange={(value: string) => formData.firstName = value}
                                        value={formData.firstName}
                                        placeholder="Prénom"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                        Nom
                                    </label>
                                    <SiteInput
                                        onChange={() => handleChange}
                                        value={formData.lastName}
                                        placeholder="Nom"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <SiteInput
                                        onChange={() => handleChange}
                                        value={formData.email}
                                        placeholder="Email"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Rôle
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="p-2 w-full border border-gray-300 bg-white rounded-md"
                                        required
                                    >
                                        <option value="student">Étudiant</option>
                                        <option value="admin">Administrateur</option>
                                        <option value="teacher">Professeur</option>
                                    </select>
                                </div>

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
                                        Mettre à jour
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
