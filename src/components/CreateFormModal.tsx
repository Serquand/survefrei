import React, { useState } from "react";
import { Organization } from "../utils/types";
import { useSelector } from "react-redux";
import SiteSelect from "./SiteSelect";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; description: string; organizationId: number }) => void;
}

const CreateFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [organizationId, setOrganizationId] = useState<number>();
    const organizations: Organization[] = useSelector((state: any) => state.organization.organizations);

    const handleSubmit = () => {
        if (!title || !description || !organizationId) {
            alert("Veuillez remplir tous les champs.");
            return;
        }
        onSubmit({ title, description, organizationId });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">Création d'un formulaire</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Nom du formulaire"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Description du formulaire"
                        rows={3}
                    />
                </div>

                <SiteSelect
                    modelValue={organizationId}
                    onUpdate={(e) => setOrganizationId(+e.target.value)}
                    options={organizations.map((org) => ({ label: org.name, id: org.id }))}
                    label="Sélectionnez une organisation"
                    optionKey="id"
                    optionLabel="label"
                />

                <div className="flex justify-end pt-6 gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateFormModal;
