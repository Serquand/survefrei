import { TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

interface Props {
    title: string;
    id: number;
    description: string;
    organizationName: string;
}

const SurveyCard = (props: Props) => {
    const navigate = useNavigate();
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVzdGViYW52aW5jZW50Lm1haWxAZ21haWwuY29tIiwidXNlcklkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzI4ODk1ODl9.RA9_ZalRKeQNVG_A6Cc-LIEAPIbCzRxnGniLYQAu9P8";

    const deleteSurvey = async (e: any) => {
        e.stopPropagation();
        const API_URL = import.meta.env.VITE_API_URL;
        const requestOptions = {
            method: "DELETE",
            headers: { Authorization: 'Bearer ' + accessToken }
        }
        await fetch(API_URL + '/survey/' + props.id, requestOptions);
    }

    return (
        <div
            className="border group border-gray-300 cursor-pointer bg-white px-4 py-5 sm:px-6"
            onClick={() => navigate("/form/" + props.id)}
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
                                    <span>{props.title}</span>
                                </h3>

                                <div
                                    className="size-[22px] flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100"
                                    onClick={deleteSurvey}
                                >
                                    <TrashIcon className="size-5 text-red-600" />
                                </div>
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