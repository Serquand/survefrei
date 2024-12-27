import React, { useState } from "react";
import { Organization, User } from "../utils/types";
import InputField from "./SiteGlobalInput";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

interface Props {
    isOpen: boolean;
    mode?: "edition" | 'creation';
    onClose: () => void;
    onOrganizationCreate: (newOrganization: Organization) => void;
    onOrganizationUpdate: (newOrganization: Organization, organizationId: number) => void;
    updatedOrganizationId?: number;
}

const CreateOrganizationModal: React.FC<Props> = ({ isOpen, onClose, onOrganizationCreate, onOrganizationUpdate, updatedOrganizationId, mode = "creation" }) => {
    const { t } = useTranslation();
    const [organizationName, setOrganizationName] = useState<string>("");
    const user = useSelector((state: any) => state.user.user) as User;
    const accessToken = user.accessToken;
    const API_URL = import.meta.env.VITE_API_URL;

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if(!organizationName) return;

        try {
            const dataToSend = mode == 'creation' ? { name: organizationName, memberIds: [] } : { name: organizationName }
            const requestOptions = {
                method: mode === 'creation' ? "POST" : 'PUT',
                body: JSON.stringify(dataToSend),
                headers: { "Content-Type": "application/json", Authorization: 'Bearer ' + accessToken }
            };
            const url = `${API_URL}/organization/${mode == 'edition' ? updatedOrganizationId : ''}`
            const response = await fetch(url, requestOptions);
            const data: Organization = await response.json();

            setOrganizationName("");
            if(mode === 'creation') return onOrganizationCreate(data);
            else return onOrganizationUpdate(data, updatedOrganizationId!);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">{t('CreateOrg')}</h2>
                <InputField
                    id="create-organization-name"
                    modelValue={organizationName}
                    onUpdate={(e) => setOrganizationName(e as string)}
                    label={t("OrgName")}
                    placeholder={t("OrgNew")}
                />

                <div className="flex justify-end mt-6 gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {t("Validate")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateOrganizationModal;
