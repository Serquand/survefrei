import { useEffect, useState } from "react";
import { SurveyWithAnswer, User } from "../utils/types";
import { useParams } from "react-router-dom";
import SiteGlobalKPI from "../components/SiteGlobalKPI";
import { sendOrderedFields } from "../utils/utils";
import CollapsibleSection from "../components/CollapsibleSection";
import { useSelector } from "react-redux";

const AnswersPage = () => {
    const [answers, setAnswers] = useState<SurveyWithAnswer | undefined>(undefined);
    const API_URL = import.meta.env.VITE_API_URL;
    const userLoggedIn = useSelector((state: any) => state.user.user) as User;
    const accessToken = userLoggedIn.accessToken;
    const { id } = useParams<{ id: string; }>();

    useEffect(() => {
        const getUserAnswers = async () => {
            const headers = { Authorization: 'Bearer ' + accessToken };
            const response = await fetch(`${API_URL}/user-answer/${id}`, { headers });
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
                            answers={field.answers.map((answer) => ({questionId: answer.id, value: answer.value, valueText: answer.valueText}))}
                            fieldType={field.fieldType}
                            label={field.label}
                        />
                    </CollapsibleSection>
                </div>
            ))}
        </div>
    </>)
}

export default AnswersPage;