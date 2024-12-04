import { TrashIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { User } from "../utils/types";

interface Props {
    title: string;
    id: number;
    description: string;
    organizationName: string;
    onDeleteForm: (id: number) => void,
    isPublic: boolean;
    canDelete: boolean;
    mustShowPublicationStatus?: boolean;
}

const SurveyCard = (props: Props) => {
    const navigate = useNavigate();
    const userLoggedIn = useSelector((state: any) => state.user.user) as User;
    const accessToken = userLoggedIn.accessToken;
    const location = useLocation();

    const navigateToFormPage = () => {
        switch(location.pathname) {
            case '/to-fill': return navigate(`/form/${props.id}/fill`)

            case '/forms':
                if(props.isPublic) return navigate(`/form/${props.id}/answers`)
                else  return navigate(`/form/${props.id}/edition`)

            case '/filled': return navigate(`/form/${props.id}/review`)
        }
    }

    const deleteSurvey = async (e: any) => {
        e.stopPropagation();
        const API_URL = import.meta.env.VITE_API_URL;
        const requestOptions = {
            method: "DELETE",
            headers: { Authorization: 'Bearer ' + accessToken }
        }
        await fetch(API_URL + '/survey/' + props.id, requestOptions);
        props.onDeleteForm(props.id);
    }

    return (
        <div
            className="border group border-gray-300 cursor-pointer bg-white px-4 py-5 sm:px-6"
            onClick={navigateToFormPage}
        >
            <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="ml-4 mt-4">
                    <div className="flex items-center">
                        <div className="shrink-0 relative">
                            <img
                                className="size-12 rounded-full"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                            />
                        </div>
                        <div className="ml-4 overflow-hidden">
                            <div className="flex gap-2">
                                <h3 className="text-base font-semibold text-gray-900">
                                    <span>{props.title}
                                        {props.mustShowPublicationStatus ? <span>, {props.isPublic ? 'P' : 'Non p'}ublié</span> : null}
                                    </span>
                                </h3>

                                {props.canDelete ? <div
                                    className="size-[22px] flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100"
                                    onClick={deleteSurvey}
                                >
                                    <TrashIcon className="size-5 text-red-600" />
                                </div> : null}
                            </div>

                            <p className="text-sm text-gray-600 overflow-hidden w-full text-wrap break-words">
                                <span>{props.organizationName}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-gray-500 text-sm mt-3">{props.description}</p>
        </div>
    )
}

export default SurveyCard;