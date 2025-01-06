import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Answer, Survey as SurveyInterface, SurveyField, SurveyFieldType, User, NotificationsInformations } from "../utils/types";
import { useSelector } from "react-redux";
import InputField from "../components/SiteGlobalInput";
import SiteCheckbox from "../components/SiteCheckbox";
import SiteSelect from "../components/SiteSelect";
import { sendOrderedFields } from "../utils/utils";
import { handleErrorInFetchRequest } from "../utils/utils";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Notification, { NotificationRef } from "./SiteNotifications";
import { useTranslation } from "react-i18next";

const Survey = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams<{ id: string; }>();
    const [form, setForm] = useState<SurveyInterface | undefined>(undefined);
    const [answers, setAnswers] = useState<Answer[] | undefined>(undefined);
    const API_URL = import.meta.env.VITE_API_URL;
    const userLoggedIn = useSelector((state: any) => state.user.user) as User;
    const accessToken = userLoggedIn.accessToken;
    const isDisabledForm = false;

    // Notifications
    const emptyNotificationsInformations: NotificationsInformations = { informations: "", title: "" };
    const [notificationInformations, setNotificationInformations] = useState<NotificationsInformations>(emptyNotificationsInformations);
    const notificationRef = useRef<NotificationRef>(null);

    useEffect(() => {
        const getForm = async () => {
            // Fetch data
            const headers = { Authorization: 'Bearer ' + accessToken };
            const response = await fetch(API_URL + '/survey/' + id, { headers });
            if (!response.ok) {
                return handleErrorInFetchRequest(response, setNotificationInformations, notificationRef, i18n.language as "fr" | "en", t);
            }

            const data = await response.json();
            data.fields = sendOrderedFields(data.fields);
            setForm(data);
            setAnswers(() => data.fields.map((field: SurveyField) => ({ questionId: field.id, value: '' })));
        }
        getForm();
    }, []);

    const updateAnswer = (index: number, newValue: any) => {
        setAnswers(prevAnswers => {
            // @ts-ignore
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[index] = { ...updatedAnswers[index], value: newValue };
            return updatedAnswers;
        });
    }

    const convertFieldTypeToInputType = (fieldType: SurveyFieldType) => {
        switch (fieldType) {
            case SurveyFieldType.NUMBER: return 'number';
            case SurveyFieldType.TEXTAREA: return 'textarea';
            default: return 'text';
        }
    }

    const submitAnswers = async () => {
        try {
            const requestOptions = {
                method: "POST",
                headers: { Authorization: 'Bearer ' + accessToken, "Content-Type": 'application/json' },
                body: JSON.stringify({ answers })
            };
            const response = await fetch(`${API_URL}/user-answer/${id}`, requestOptions);
            if (!response.ok) {
                return handleErrorInFetchRequest(response, setNotificationInformations, notificationRef, i18n.language as "fr" | "en", t);
            }

            await response.json();
        } catch {
            // TODO
        }
    }

    return (
        <>
            <div className="w-4/5 mx-auto items-center">
                <div className="grid gap-5">
                    {(form && answers && form.fields) ? (<>
                        {form.fields.map((field, index) => (<>
                            {(field.fieldType !== SurveyFieldType.CHECKBOX && field.fieldType !== SurveyFieldType.SELECT) ? <InputField
                                id={"question-" + field.id}
                                modelValue={answers[index].value}
                                onUpdate={(e) => updateAnswer(index, e)}
                                label={field.label}
                                required={field.required}
                                type={convertFieldTypeToInputType(field.fieldType)}
                                disabled={isDisabledForm}
                                placeholder={field.label}
                                key={index}
                            /> : null}

                            {field.fieldType === SurveyFieldType.CHECKBOX ? <SiteCheckbox
                                id={"question-" + field.id}
                                onUpdate={(e) => updateAnswer(index, e)}
                                label={field.label}
                                modelValue={answers[index].value as boolean}
                                disabled={isDisabledForm}
                                key={index}
                            /> : null}

                            {field.fieldType === SurveyFieldType.SELECT ? <SiteSelect
                                modelValue={answers[index].value}
                                key={index}
                                options={field.choices.map((choice) => ({ label: choice.label }))}
                                optionLabel="label"
                                label={field.label}
                                onUpdate={(e) => updateAnswer(index, e)}
                                optionKey="label"
                            /> : null}
                        </>))}
                    </>) : null}
                </div>

                <div className="flex justify-center pt-10">
                    <button
                        className="p-2 col-span-full px-7 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                        onClick={submitAnswers}
                    >
                        {t("SubmitAnswers")}
                    </button>
                </div>
            </div>

            <Notification
                ref={notificationRef}
                title={notificationInformations.title}
                information={notificationInformations.informations}
            >
                <XCircleIcon className="h-6 w-6 text-red-600" />
            </Notification>
        </>
    );
}

export default Survey;