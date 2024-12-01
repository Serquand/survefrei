import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SurveyField from "../components/SurveyField";
import { Survey } from '../utils/types';

const DetailedForm = () => {
    const { id } = useParams<{ id: string; }>();
    const [form, setForm] = useState<Survey | undefined>(undefined);
    const API_URL = import.meta.env.VITE_API_URL;
    const accessToken = import.meta.env.VITE_ACCESS_TOKEN_ADMIN;

    const findMaxOrder = (): number => {
        if (!form || form.fields.length === 0) return 1;
        return Math.max(...form.fields.map(field => field.order)) + 1;
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

    useEffect(() => {
        const getForm = async () => {
            const headers = { Authorization: 'Bearer ' + accessToken };
            const response = await fetch(API_URL + '/survey/' + id, { headers });
            const data = await response.json();
            setForm(data);
            console.log(data);
        }
        getForm();
    }, []);

    return (
        <div className="relative flex flex-col min-h-screen">
            <div className="flex-grow">
                <div className="divide-y flex flex-col w-4/5 mx-auto gap-5 mb-14">
                    {form && form.fields.map((field, index) => (
                        <div className="pt-5">
                            <SurveyField
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

export default DetailedForm;