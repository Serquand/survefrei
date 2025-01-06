import { useEffect, useMemo, useRef, useState } from "react";
import UserCard from "../components/UserCard";
import { NotificationsInformations, Roles, User } from "../utils/types";
import ModalUser, { CreateNewUSer } from "../components/ModalUser";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import ConfirmationModal, { ConfirmationModalRef } from "../components/ConfirmationModal";
import { PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { findSearchedArray, handleErrorInFetchRequest } from "../utils/utils";
import InputField from "../components/SiteGlobalInput";
import Notification, { NotificationRef } from "../components/SiteNotifications";

const UsersPage = () => {
    const { t, i18n } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<Omit<User, 'accessToken'>[]>([]);
    const userLoggedIn = useSelector((state: any) => state.user.user) as User;
    const accessToken = userLoggedIn.accessToken;
    const [userSearchQuery, setUserSearchQuery] = useState<string>("");
    const newUser: Partial<CreateNewUSer> = { email: '', firstName: '', id: 0, lastName: '', role: Roles.STUDENT, password: '' }
    const [updatedUser, setUpdatedUser] = useState<Partial<CreateNewUSer>>(newUser);
    const modalRef = useRef<ConfirmationModalRef>(null);

    // Notifications
    const emptyNotificationsInformations: NotificationsInformations = { informations: "", title: "" };
    const [notificationInformations, setNotificationInformations] = useState<NotificationsInformations>(emptyNotificationsInformations);
    const notificationRef = useRef<NotificationRef>(null);

    const usersSearched = useMemo(() => findSearchedArray<Omit<User, "accessToken">>(users, userSearchQuery, ["email", "firstName", "lastName"]), [userSearchQuery, users]);

    const fetchUsers = async () => {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(API_URL + '/user/all', {
            headers: { Authorization: 'Bearer ' + accessToken }
        });

        if (!response.ok) {
            return handleErrorInFetchRequest(response, setNotificationInformations, notificationRef, i18n.language as "fr" | "en", t);
        }

        const data = await response.json();
        setUsers(data);
    }

    const deleteUser = async (userId: number) => {
        const API_URL = import.meta.env.VITE_API_URL;
        const requestOptions = {
            method: "DELETE",
            headers: { Authorization: 'Bearer ' + accessToken }
        }
        const response = await fetch(API_URL + '/user/' + userId, requestOptions);
        if (!response.ok) {
            handleErrorInFetchRequest(response, setNotificationInformations, notificationRef, i18n.language as "fr" | "en", t);
        }
        return response.ok;
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setUpdatedUser(newUser);
    }

    const addUser = (newUser: Omit<User, 'accessToken'>) => {
        setUsers([...users, newUser]);
        closeModal();
    }

    const removeUser = async (userId: number) => {
        if (modalRef.current) {
            const validateUserDeletion = await modalRef.current.openModal();
            if (validateUserDeletion) {
                const success = await deleteUser(userId);
                success && setUsers(users.filter(user => user.id !== userId));
            }
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
            <div className="sticky top-0 z-10 mt-3 bg-white shadow-md">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                        <div className="-mt-2">
                            <InputField
                                id="user-query-input"
                                modelValue={userSearchQuery}
                                onUpdate={(e) => setUserSearchQuery(e as string)}
                                placeholder={t("UserSearch")}
                            />
                        </div>

                    </div>

                    <button
                        className="p-2 hidden sm:block bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                        onClick={() => setIsModalOpen(true)}
                    >
                        {t('UserAdd')}
                    </button>

                    <button
                        className="size-14 sm:hidden rounded-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <PlusIcon className="size-8 text-white" />
                    </button>
                </div>
            </div>

            <div className="grid divide-y sm:divide-y-0 sm:mt-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full sm:px-12 sm:gap-5 mx-auto pb-6">
                {users && usersSearched && usersSearched.map((user) => (
                    <div>
                        <UserCard
                            key={user.id}
                            user={user}
                            onRemoveUser={() => removeUser(user.id)}
                        />
                    </div>
                ))}
            </div>

            <ModalUser
                mode="creation"
                isOpen={isModalOpen}
                onClose={closeModal}
                onUpdateUser={addUser}
                user={updatedUser}
            />

            <ConfirmationModal ref={modalRef}>
                <p>{t("ConfirmUserDeletion")}</p>
            </ConfirmationModal>

            <Notification
                ref={notificationRef}
                title={notificationInformations.title}
                information={notificationInformations.informations}
            >
                <XCircleIcon className="h-6 w-6 text-red-600" />
            </Notification>
        </>
    );
};

export default UsersPage;