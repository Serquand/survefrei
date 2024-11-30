import { TrashIcon } from "@heroicons/react/24/outline";

interface Props {
    fullName: string;
    role: string;
    email: string;
    id: number;
}

const UserCard = (props: Props) => {
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVzdGViYW52aW5jZW50Lm1haWxAZ21haWwuY29tIiwidXNlcklkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzI4ODk1ODl9.RA9_ZalRKeQNVG_A6Cc-LIEAPIbCzRxnGniLYQAu9P8";
    const deleteUser = async () => {
        const API_URL = import.meta.env.VITE_API_URL;
        const requestOptions = {
            method: "DELETE",
            headers: { Authorization: 'Bearer ' + accessToken }
        }
        await fetch(API_URL + '/user/' + props.id, requestOptions);
    }

    return (
        <div className="border group border-gray-200 bg-white px-4 py-5 sm:px-6">
            <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="ml-4 mt-4">
                    <div className="flex items-center">
                        <div className="shrink-0 relative">
                            <img
                                className="size-12 rounded-full"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                            />
                            <div
                                className="cursor-pointer bg-red-600 opacity-0 group-hover:opacity-100 size-7 rounded-full absolute -bottom-2 right-0 flex justify-center items-center"
                                onClick={deleteUser}
                            >
                                <TrashIcon className="size-5 text-white"/>
                            </div>
                        </div>
                        <div className="ml-4 overflow-hidden">
                            <h3 className="text-base font-semibold text-gray-900">
                                <span>Esteban VINCENT</span> -&nbsp;
                                <span>Admin</span>
                            </h3>

                            <p className="text-sm text-gray-500 overflow-hidden w-full text-wrap break-words">
                                @ <span>esteban.vincentvincentvincent@efrei.net</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCard;