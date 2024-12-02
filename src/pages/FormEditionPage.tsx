import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SurveyFieldBuilder from "../components/SurveyFieldBuilder";
import { Organization, Survey } from '../utils/types';
import InputField from "../components/SiteGlobalInput";
import { useSelector } from "react-redux";
import SiteCheckbox from "../components/SiteCheckbox";
import SiteSelect from "../components/SiteSelect";

const FormEditionPage = () => {
    const { id } = useParams<{ id: string; }>();
    const [form, setForm] = useState<Survey | undefined>(undefined);
    const API_URL = import.meta.env.VITE_API_URL;
    const accessToken = import.meta.env.VITE_ACCESS_TOKEN_ADMIN;
    const organizations: Organization[] = useSelector((state: any) => state.organization.organizations);
    const navigate = useNavigate();

    const findMaxOrder = (): number => {
        if (!form || form.fields.length === 0) return 1;
        return Math.max(...form.fields.map(field => field.order)) + 1;
    }

    const organizationOptions: { label: string, id: number }[] = organizations.map((org) => ({ id: org.id, label: org.name }));

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
        setForm(prevForm => ({
            ...prevForm,
            fields: prevForm?.fields ? [...prevForm.fields, data] : [data]
        }));
    }

    const deleteField = (fieldId: number) => {
        console.log(fieldId);

        // @ts-ignore
        setForm(prevForm => ({
            ...prevForm,
            fields: prevForm?.fields.filter((field) => field.id !== fieldId)
        }));
    }

    const updateForm = (key: keyof Survey, newValue: any) => {
        // @ts-ignore
        setForm(prevForm => ({
            ...prevForm,
            [key]: newValue
        }));
    }

    useEffect(() => {
        const getForm = async () => {
            const headers = { Authorization: 'Bearer ' + accessToken };
            const response = await fetch(API_URL + '/survey/' + id, { headers });
            const data = await response.json();
            alert(JSON.stringify(data, null, 2));
            if (data.isPublic) return navigate("/"); // If the survey is already public, the admin, or whoever he is, cannot update the survey. Error => Go on login

            const organization = organizations.find(org => org.id === data.organizationId)
            console.log(Object.keys(data));

            setForm({...data, organization});
        }
        getForm();
    }, []);

    return (
        <div className="relative flex flex-col min-h-screen">
            <div className="flex-grow w-4/5 mx-auto pt-10 divide-y-2">
                {/* <pre>{JSON.stringify(form.organization.name, null, 2)}</pre> */}

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
                            onUpdate={(e) => updateForm('isPublic', e)}
                            label="Formulaire public ?"
                            modelValue={form.isPublic}
                        />

                        <SiteSelect
                            modelValue={1}
                            onUpdate={(e) => console.log(e)}
                            options={organizationOptions}
                            required={true}
                            label="Organisation"
                        />
                    </div>
                </div> : null}

                <div className="divide-y flex flex-col mx-auto gap-5 mb-14">
                    {form && form.fields.map((field, index) => (
                        <div className="pt-5">
                            <SurveyFieldBuilder
                                currentPlaceOfField={index + 1}
                                field={field}
                                numberOfFields={form.fields.length}
                                surveyId={form.id}
                                onDeleteField={() => deleteField(field.id)}
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
    );
};

export default FormEditionPage;