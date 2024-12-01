import { useEffect, useState } from "react";
import SurveyCard from "../components/SurveyCard";
import { SurveyPreview } from "../utils/types";

const FormsPage = () => {
    const [surveys, setSurveys] = useState<SurveyPreview[]>();
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVzdGViYW52aW5jZW50Lm1haWxAZ21haWwuY29tIiwidXNlcklkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzI4ODk1ODl9.RA9_ZalRKeQNVG_A6Cc-LIEAPIbCzRxnGniLYQAu9P8";
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchSurveys = async () => {
            const headers = { Authorization: 'Bearer ' + accessToken };
            const response = await fetch(API_URL + '/survey', { headers });
            const data = await response.json();
            setSurveys(data);
        }
        fetchSurveys();
    })

    return (
        <div className="flex flex-col px-12 gap-5 py-6">
            {(surveys && surveys.length > 0) ? surveys.map((survey, index) => {
                return (
                    <SurveyCard
                        description={survey.description}
                        id={survey.id}
                        organizationName={survey.organization.name}
                        title={survey.title}
                        key={index}
                    />
                );
            }): null}
        </div>
    );
};

export default FormsPage;