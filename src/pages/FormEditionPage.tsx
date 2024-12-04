import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SurveyFieldBuilder from "../components/SurveyFieldBuilder";
import { Organization, Survey, SurveyField, User } from '../utils/types';
import InputField from "../components/SiteGlobalInput";
import { useSelector } from "react-redux";
import SiteCheckbox from "../components/SiteCheckbox";
import SiteSelect from "../components/SiteSelect";
import ConfirmationModal from "../components/ConfirmationModal";
import { moveElement, sendOrderedFields } from "../utils/utils";

const FormEditionPage = () => {
    const debounceTimeMs = 2_500;
    const { id } = useParams<{ id: string; }>();
    const [form, setForm] = useState<Survey | undefined>(undefined);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const userLoggedIn = useSelector((state: any) => state.user.user) as User;
    const accessToken = userLoggedIn.accessToken;
    const organizations: Organization[] = useSelector((state: any) => state.organization.organizations);
    const organizationOptions: { label: string, id: number }[] = organizations.map((org) => ({ id: org.id, label: org.name }));
    const [updatingKey, setUpdatingKey] = useState<number>(0);
    const navigate = useNavigate();

    // @ts-ignore
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

    const fieldsOrdered = useMemo(() => {
        if (!form || !form.fields) return [];
        setUpdatingKey(prev => prev + 1);
        return sendOrderedFields(form.fields);
    }, [form?.fields]);

    const onTriggerPublishButton = (publishmentValue: boolean) => {
        setForm(prevForm => ({ ...prevForm!, isPublic: publishmentValue }));
        publishmentValue && setIsConfirmModalOpen(true);
    }

    const onCancelPublishment = () => {
        setForm(prevForm => ({ ...prevForm!, isPublic: false }));
        setIsConfirmModalOpen(false);
    }

    const onValidatePublishment = async () => {
        if (saveTimeout) clearTimeout(saveTimeout);
        await saveForm(form);
        setIsConfirmModalOpen(false);
        navigate('/forms')
    }

    const findMaxOrder = (): number => {
        if (!form || form.fields.length === 0) return 1;
        return Math.max(...form.fields.map(field => field.order));
    }

    const createNewField = async () => {
        const body = { fieldType: "TX", label: "Mon champ", order: findMaxOrder() + 1 };
        const requestOptions = {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                Authorization: 'Bearer ' + accessToken,
                "Content-Type": "application/json"
            }
        }
        const response = await fetch(`${API_URL}/survey/${id}/field`, requestOptions);
        const data = await response.json();

        // @ts-ignore
        setForm(prevForm => {
            return { ...prevForm, fields: prevForm?.fields ? [...prevForm.fields, data] : [data] };
        });
    }

    const saveForm = async (newForm: any) => {
        const { fields, organization, id, ...formToSave } = newForm;
        const requestOptions = {
            headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify(formToSave),
        };
        await fetch(`${API_URL}/survey/${id}`, requestOptions);
    }

    const setDebounceToSaveField = (newForm: any) => {
        if (saveTimeout) clearTimeout(saveTimeout);

        const timeout = setTimeout(() => saveForm(newForm), debounceTimeMs);
        setSaveTimeout(timeout);

        return () => {
            if (saveTimeout) clearTimeout(saveTimeout);
        };

    };

    const deleteField = (fieldId: number) => {
        // @ts-ignore
        setForm(prevForm => {
            const newForm = { ...prevForm, fields: prevForm?.fields.filter((field) => field.id !== fieldId) };
            setDebounceToSaveField(newForm);
            return newForm;
        });
    }

    const updateForm = (key: keyof Survey, newValue: any) => {
        // @ts-ignore
        setForm(prevForm => {
            const newForm = { ...prevForm, [key]: newValue }
            setDebounceToSaveField(newForm);
            return newForm;
        });
    }

    const handleUpdatePosition = async (fieldId: number, newPosition: number) => {
        const patchOrderField = async (field: SurveyField) => {
            const requestOptions = {
                method: "PUT",
                headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: field.order })
            }
            await fetch(`${API_URL}/survey/${id}/field/${field.id}`, requestOptions);
        }

        const fields = form!.fields;
        const oldIndex = fields.findIndex(f => f.id === fieldId);
        const newFieldsArray = moveElement(fields, oldIndex, newPosition - 1);
        setForm(prev => {
            const newForm = { ...prev!, fields: newFieldsArray };
            return newForm;
        });
        await Promise.all(newFieldsArray.map(patchOrderField));
    }

    const handleUpdateField = (newField: SurveyField, fieldId: number) => {
        // @ts-ignore
        setForm(prevForm => {
            const newFields = prevForm!.fields.map(field => field.id === fieldId ? newField : field);
            return { ...prevForm, fields: newFields };
        });
    }

    useEffect(() => {
        const getForm = async () => {
            const headers = { Authorization: 'Bearer ' + accessToken };
            const response = await fetch(API_URL + '/survey/' + id, { headers });
            const data = await response.json();
            if (data.isPublic) return navigate(`form/${id}/answers"`);

            const organization = organizations.find(org => org.id === data.organizationId)
            console.log(Object.keys(data));

            setForm({ ...data, organization });
        }
        getForm();
    }, []);

    return (
        <>
            <div className="relative flex flex-col min-h-screen">
                <div className="flex-grow w-4/5 mx-auto pt-10 divide-y-2">
                    {form ? <div className="flex flex-col gap-6 pb-12">
                        <InputField
                            modelValue={form.title}
                            onUpdate={(e) => updateForm('title', e)}
                            id="form-title"
                            type="text"
                            required={true}
                            label="Titre du formulaire"
                            disabled={false}
                        />

                        <InputField
                            modelValue={form.description}
                            onUpdate={(e) => updateForm('description', e)}
                            id="form-description"
                            type="textarea"
                            required={true}
                            label="Description du formulaire"
                            disabled={false}
                        />

                        <div className="grid grid-cols-2">
                            <SiteCheckbox
                                id="form-published"
                                onUpdate={onTriggerPublishButton}
                                label="Formulaire public ?"
                                modelValue={form.isPublic}
                            />

                            <SiteSelect
                                modelValue={1}
                                onUpdate={(e) => console.log(e)}
                                options={organizationOptions}
                                required={false}
                                label="Organisation"
                            />
                        </div>
                    </div> : null}

                    <div
                        className="divide-y flex flex-col mx-auto gap-5 mb-14"
                        key={updatingKey}
                    >
                        {fieldsOrdered && fieldsOrdered.length > 0 && fieldsOrdered.map((field, index) => (
                            <div
                                className="pt-5"
                                key={`field-${field.id}`}
                            >
                                <SurveyFieldBuilder
                                    currentPlaceOfField={index + 1}
                                    field={field}
                                    numberOfFields={fieldsOrdered.length}
                                    surveyId={form!.id}
                                    onDeleteField={() => deleteField(field.id)}
                                    onUpdatePosition={(newPosition) => handleUpdatePosition(field.id, newPosition)}
                                    onUpdateField={newField => handleUpdateField(newField, field.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="self-center mb-4">
                    <button
                        className="px-6 py-3 text-white bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 focus:ring-4 focus:ring-green-300 rounded-lg shadow-lg shadow-green-500/50 hover:shadow-xl transition-all duration-300 ease-in-out"
                        onClick={createNewField}
                    >
                        Ajouter un champ
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onCancel={onCancelPublishment}
                onValidate={onValidatePublishment}
            >
                <p>Êtes-vous sûr de vouloir publier ce formulaire ?</p>
            </ConfirmationModal>
        </>
    );
};

export default FormEditionPage;