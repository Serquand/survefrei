import { useEffect, useState, useRef, useMemo } from "react";
import { CreationSurvey, Organization, Roles, SurveyPreview, User } from "../utils/types";
import { PlusIcon } from "@heroicons/react/24/outline";
import CreateFormModal from "../components/CreateFormModal";
import { useNavigate } from "react-router-dom";
import ListPreviewForm from "../components/ListPreviewForm";
import { useSelector } from "react-redux";
import ConfirmationModal, { ConfirmationModalRef } from "../components/ConfirmationModal";
import { findSearchedArray } from "../utils/utils";
import InputField from "../components/SiteGlobalInput";

const FormsPage = () => {
    const [surveys, setSurveys] = useState<SurveyPreview[]>();
    const [creationModalOpen, isModalCreationOpen] = useState(false);
    const [organizations, setOrganizations] = useState<Organization[] | undefined>(undefined);
    const user = useSelector((state: any) => state.user.user) as User;
    const API_URL = import.meta.env.VITE_API_URL;
    const accessToken = user.accessToken;
    const modalRef = useRef<ConfirmationModalRef>(null);
    const navigate = useNavigate();
    const [searchFormQuery, setSearchFormQuery] = useState<string>("");

    const filteredForms = useMemo(() => findSearchedArray<SurveyPreview>(surveys, searchFormQuery, ["title"]), [searchFormQuery, surveys]);

    const fetchSurveys = async () => {
        const headers = { Authorization: 'Bearer ' + accessToken };
        const response = await fetch(API_URL + '/survey', { headers });
        const data = await response.json();
        setSurveys(data);
    }

    const fetchOrganizations = async () => {
        const headers = { Authorization: 'Bearer ' + accessToken };
        const response = await fetch(API_URL + '/organization', { headers });
        const data = await response.json();
        setOrganizations(data);
    }

    useEffect(() => {
        fetchSurveys();
        fetchOrganizations()
    }, []);

    const postNewSurvey = async (data: CreationSurvey) => {
        const requestOptions = {
            headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, isPublic: false }),
            method: "POST"
        };
        const response = await fetch(API_URL + '/survey', requestOptions);
        const newSurvey = await response.json();
        navigate(`/form/${newSurvey.id}/edition`);
    }

    const removeSurvey = async (surveyId: number) => {
        try {
            if (!modalRef.current) return;
            const validateUserDeletion = await modalRef.current.openModal();
            if (!validateUserDeletion) return;

            await deleteSurvey(surveyId);

            setSurveys(surveys!.filter(survey => survey.id !== surveyId))
        } catch {
            // TODO
        }
    }

    const deleteSurvey = async (surveyId: number) => {
        const API_URL = import.meta.env.VITE_API_URL;
        const requestOptions = {
            method: "DELETE",
            headers: { Authorization: 'Bearer ' + accessToken }
        }
        await fetch(API_URL + '/survey/' + surveyId, requestOptions);
    }

    return (
        <>
            {(surveys && surveys.length > 0) && <div className="md:px-12 pt-3 sticky top-0 w-full bg-white z-50">
                <InputField
                    id="search-form-query"
                    modelValue={searchFormQuery}
                    onUpdate={e => setSearchFormQuery(e as string)}
                    placeholder="Formulaire recherché"
                />
            </div>}

            {surveys && filteredForms ? <ListPreviewForm
                onDeleteForm={removeSurvey}
                surveys={surveys}
                mustShowPublicationStatus={user.role === Roles.ADMIN}
                canDelete={user.role === Roles.ADMIN}
            /> : null}

            {user.role === Roles.ADMIN && organizations ? <div
                className="fixed bottom-10 right-10 size-14 rounded-full bg-green-600 flex items-center justify-center cursor-pointer"
                onClick={() => isModalCreationOpen(true)}
            >
                <PlusIcon className="size-10 text-white" />
            </div> : null}

            {(user.role === Roles.ADMIN && organizations) ? <CreateFormModal
                organizations={organizations}
                isOpen={creationModalOpen}
                onClose={() => isModalCreationOpen(false)}
                onSubmit={postNewSurvey}
            /> : null}

            <ConfirmationModal ref={modalRef}>
                <p>Voulez-vous vraiment supprimer ce formulaire ?</p>
            </ConfirmationModal>
        </>
    );
};

export default FormsPage;