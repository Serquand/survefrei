import { SurveyPreview } from "../utils/types";
import SurveyCard from "./SurveyCard";
import ConfirmationModal, { ConfirmationModalRef } from "../components/ConfirmationModal";
import { useRef } from "react";

interface Props {
    surveys: SurveyPreview[];
    canDelete: boolean;
    onDeleteForm?: (id: number) => void;
    mustShowPublicationStatus?: boolean;
}

const ListPreviewForm = ({ surveys, canDelete, onDeleteForm, mustShowPublicationStatus }: Props) => {
    const modalRef = useRef<ConfirmationModalRef>(null);

    const handleOnDeleteForm = (id: number) => {
        onDeleteForm && onDeleteForm(id);
    }

    return (
        <>
            <div className="flex flex-col px-12 gap-5 py-6">
                {(surveys && surveys.length > 0) ? surveys.map((survey, index) => {
                    return (
                        <SurveyCard
                            description={survey.description}
                            id={survey.id}
                            organizationName={survey.organization.name}
                            title={survey.title}
                            key={index}
                            onDeleteForm={() => handleOnDeleteForm(survey.id)}
                            isPublic={survey.isPublic}
                            canDelete={canDelete}
                            mustShowPublicationStatus={mustShowPublicationStatus}
                        />
                    );
                }) : null}
            </div>

            <ConfirmationModal ref={modalRef}>
                <p>Voulez-vous vraiment supprimer cette organisation ?</p>
            </ConfirmationModal>
        </>

    )
}

export default ListPreviewForm;