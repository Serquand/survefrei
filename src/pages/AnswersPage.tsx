import { useEffect, useState } from "react";
import { SurveyWithAnswer } from "../utils/types";
import { useParams } from "react-router-dom";
import SiteGlobalKPI from "../components/SiteGlobalKPI";
import { sendOrderedFields } from "../utils/utils";

const AnswersPage = () => {
    const [answers, setAnswers] = useState<SurveyWithAnswer | undefined>(undefined);
    const API_URL = import.meta.env.VITE_API_URL;
    const accessToken = import.meta.env.VITE_ACCESS_TOKEN_ADMIN;
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
        <div className="flex flex-col divide-y-2">
            {answers && answers.fields.map((field) => (
                <div className="py-6 w-4/5 mx-auto">
                    <SiteGlobalKPI
                        answers={field.answers}
                        fieldType={field.fieldType}
                        label={field.label}
                    />
                </div>
            ))}
        </div>
    </>)
}

export default AnswersPage;