import { useEffect, useRef, useState } from "react";
import { NotificationsInformations, SurveyWithAnswer, User } from "../utils/types";
import { useParams } from "react-router-dom";
import SiteGlobalKPI from "../components/SiteGlobalKPI";
import { handleErrorInFetchRequest, sendOrderedFields } from "../utils/utils";
import CollapsibleSection from "../components/CollapsibleSection";
import { useSelector } from "react-redux";
import Notification, { NotificationRef } from "../components/SiteNotifications";
import { useTranslation } from "react-i18next";
import { XCircleIcon } from "@heroicons/react/24/outline";

const AnswersPage = () => {
    const { i18n, t } = useTranslation();
    const [answers, setAnswers] = useState<SurveyWithAnswer | undefined>(undefined);
    const API_URL = import.meta.env.VITE_API_URL;
    const userLoggedIn = useSelector((state: any) => state.user.user) as User;
    const accessToken = userLoggedIn.accessToken;
    const { id } = useParams<{ id: string; }>();

    // Notifications
    const emptyNotificationsInformations: NotificationsInformations = { informations: "", title: "" };
    const [notificationInformations, setNotificationInformations] = useState<NotificationsInformations>(emptyNotificationsInformations);
    const notificationRef = useRef<NotificationRef>(null);

    useEffect(() => {
        const getUserAnswers = async () => {
            const headers = { Authorization: 'Bearer ' + accessToken };
            const response = await fetch(`${API_URL}/user-answer/${id}`, { headers });
            if (!response.ok) {
                return handleErrorInFetchRequest(response, setNotificationInformations, notificationRef, i18n.language as "fr" | "en", t);
            }

            const data = await response.json();
            data.fields = sendOrderedFields(data.fields);
            setAnswers(data);
        }
        getUserAnswers();
    }, []);

    return (<>
        {answers && (
            <div className="sticky top-0 bg-gray-200 text-gray-900 p-4 shadow-xl z-10">
                <h1 className="text-lg font-semibold text-center">{answers.title}</h1>
            </div>
        )}

        <div className="flex flex-col gap-6 py-6">
            {answers && answers.fields.map((field) => (
                <div className="px-6 w-full mx-auto">
                    <CollapsibleSection title={field.label}>
                        <SiteGlobalKPI
                            maxValue={field.maxValue}
                            minValue={field.minValue}
                            answers={field.answers.map((answer) => ({ questionId: answer.id, value: answer.value, valueText: answer.valueText }))}
                            fieldType={field.fieldType}
                            label={field.label}
                        />
                    </CollapsibleSection>
                </div>
            ))}
        </div>

        <Notification
            ref={notificationRef}
            title={notificationInformations.title}
            information={notificationInformations.informations}
        >
            <XCircleIcon className="h-6 w-6 text-red-600" />
        </Notification>
    </>)
}

export default AnswersPage;