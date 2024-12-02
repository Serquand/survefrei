import { useEffect, useState } from "react";
import { SurveyPreview } from "../utils/types";
import ListPreviewForm from "../components/ListPreviewForm";

const Filled = () => {
    // const user: User = useSelector(state => state.user.user);
    const [surveys, setSurveyData] = useState<SurveyPreview[] | null>(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const accessToken = import.meta.env.VITE_ACCESS_TOKEN_STUDENT;

    useEffect(() => {
        const fetchSurveyData = async () => {
            const headers = { Authorization: "Bearer " + accessToken };
            const response = await fetch(API_URL + "/survey", { headers });
            const data = await response.json();
            setSurveyData(data.filledSurvey);
        };

        fetchSurveyData();
    }, []);

    return (
        <div>
            {surveys ?
                <ListPreviewForm
                    canDelete={false}
                    surveys={surveys}
                />
            : null}
        </div>
    );
};

export default Filled;
