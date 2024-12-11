import { TrashIcon } from "@heroicons/react/24/outline";
import ModalUser from "./ModalUser";
import { User } from "../utils/types";
import { useState } from "react";

interface Props {
    user: Omit<User, "accessToken">;
    onRemoveUser: () => void;
}

const UserCard = (props: Props) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [user, setUser] = useState(props.user);

    const handleUpdateUser = (newUser: any) => {
        setUser(newUser);
        setIsModalOpen(false);
    }

    const deleteUser = (e: any) => {
        e.stopPropagation();
        props.onRemoveUser();
    }

    return (<>
        <div
            className="border group border-gray-200 bg-white px-4 py-5 sm:px-6 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
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
                            <div
                                className="cursor-pointer bg-red-600 opacity-0 group-hover:opacity-100 size-7 rounded-full absolute -bottom-2 right-0 flex justify-center items-center"
                                onClick={deleteUser}
                            >
                                <TrashIcon className="size-5 text-white" />
                            </div>
                        </div>
                        <div className="ml-4 overflow-hidden">
                            <h3 className="text-base font-semibold text-gray-900">
                                <span>{user.firstName + ' ' + user.lastName}</span> -&nbsp;
                                <span>{user.role.toUpperCase()}</span>
                            </h3>

                            <p className="text-sm text-gray-500 overflow-hidden w-full text-wrap break-words">
                                @ <span>{user.email}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ModalUser
            mode="edition"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onUpdateUser={handleUpdateUser}
            user={user}
        />
    </>)
}

export default UserCard;