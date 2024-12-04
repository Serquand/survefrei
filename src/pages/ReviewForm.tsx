import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SiteSelect from "../components/SiteSelect";
import { SurveyFieldType, SurveyWithAnswer, User } from "../utils/types";
import SiteCheckbox from "../components/SiteCheckbox";
import InputField from "../components/SiteGlobalInput";
import { sendOrderedFields } from "../utils/utils";
import { useSelector } from "react-redux";

const ReviewForm = () => {
    const { id: formId } = useParams<{ id: string; }>();
    const [form, setForm] = useState<SurveyWithAnswer | undefined>(undefined);
    const API_URL = import.meta.env.VITE_API_URL;
    const user = useSelector((state: any) => state.user.user) as User;
    const accessToken = user.accessToken;

    useEffect(() => {
        const getAnswers = async () => {
            const headers = { Authorization: 'Bearer ' + accessToken }
            const response = await fetch(`${API_URL}/user-answer/${formId}`, { headers });
            const data = await response.json();
            data.fields = sendOrderedFields(data.fields);
            setForm(data);
        }
        getAnswers();
    }, []);

    const convertFieldTypeToInputType = (fieldType: SurveyFieldType) => {
        switch (fieldType) {
            case SurveyFieldType.NUMBER: return 'number';
            case SurveyFieldType.TEXTAREA: return 'textarea';
            default: return 'text';
        }
    }

    return (<>
        <div className="relative min-h-screen">
            {form && (
                <div className="sticky top-0 bg-gray-200 text-gray-900 p-4 shadow-xl z-10">
                    <h1 className="text-lg font-semibold text-center">{form.title}</h1>
                </div>
            )}

            <div className="w-4/5 mx-auto mt-6 items-center">
                <div className="grid gap-5">
                    {(form && form.fields) ? (<>
                        {form.fields.map((field, index) => (<>
                            {(field.fieldType === SurveyFieldType.TEXTAREA || field.fieldType === SurveyFieldType.TEXT) ? <InputField
                                id={"question-" + field.id}
                                modelValue={field.answers[0].valueText}
                                label={field.label}
                                required={field.required}
                                type={convertFieldTypeToInputType(field.fieldType)}
                                disabled={true}
                                placeholder={field.label}
                                key={index}
                                onUpdate={() => console.error()}
                            /> : null}

                            {field.fieldType === SurveyFieldType.NUMBER ? <InputField
                                id={"question-" + field.id}
                                modelValue={field.answers[0].value}
                                label={`${field.label} (min. ${field.minValue}, max. ${field.maxValue})`}
                                required={field.required}
                                type={convertFieldTypeToInputType(field.fieldType)}
                                disabled={true}
                                placeholder={field.label}
                                key={index}
                                onUpdate={() => console.error()}
                            /> : null}

                            {field.fieldType === SurveyFieldType.CHECKBOX ? <SiteCheckbox
                                onUpdate={() => console.error()}
                                id={"question-" + field.id}
                                label={field.label}
                                modelValue={field.answers[0].value as boolean}
                                disabled={true}
                                key={index}
                            /> : null}

                            {field.fieldType === SurveyFieldType.SELECT ? <SiteSelect
                                modelValue={(field.answers[0].value as string[]).map(el => el)}
                                key={index}
                                options={field.choices.map((choice) => ({ label: choice.label }))}
                                optionLabel="label"
                                label={field.label}
                                optionKey="label"
                                onUpdate={() => console.error()}
                                disabled={true}
                            /> : null}
                        </>))}
                    </>) : null}
                </div>
            </div>
        </div>
    </>)
}

export default ReviewForm;