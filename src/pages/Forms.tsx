import { useEffect, useState } from "react";
import { CreationSurvey, SurveyPreview } from "../utils/types";
import { PlusIcon } from "@heroicons/react/24/outline";
import CreateFormModal from "../components/CreateFormModal";
import { useNavigate } from "react-router-dom";
import ListPreviewForm from "../components/ListPreviewForm";

const FormsPage = () => {
    const [surveys, setSurveys] = useState<SurveyPreview[]>();
    const [creationModalOpen, isModalCreationOpen] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const accessToken = import.meta.env.VITE_ACCESS_TOKEN_ADMIN;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSurveys = async () => {
            const headers = { Authorization: 'Bearer ' + accessToken };
            const response = await fetch(API_URL + '/survey', { headers });
            const data = await response.json();
            setSurveys(data);
        }
        fetchSurveys();
    }, []);

    const postNewSurvey = async (data: CreationSurvey) => {
        const requestOptions = {
            headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({...data,  }),
            method: "POST"
        };
        const response = await fetch(API_URL + '/survey', requestOptions);
        const newSurvey = await response.json();
        navigate(`/form/${newSurvey.id}/edition`);
    }

    return (
        <>
            {surveys ? <ListPreviewForm
                canDelete={true}
                onDeleteForm={(id) => setSurveys(surveys.filter(survey => survey.id !== id))}
                surveys={surveys}
                mustShowPublicationStatus={true}
            /> : null}

            <div
                className="absolute bottom-10 right-10 size-14 rounded-full bg-green-600 flex items-center justify-center cursor-pointer"
                onClick={() => isModalCreationOpen(true)}
            >
                <PlusIcon className="size-10 text-white" />
            </div>

            <CreateFormModal
                isOpen={creationModalOpen}
                onClose={() => isModalCreationOpen(false)}
                onSubmit={postNewSurvey}
            />
        </>
    );
};

export default FormsPage;