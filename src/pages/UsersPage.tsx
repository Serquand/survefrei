import { useEffect, useState } from "react";
import SiteInput from "../components/SiteInput";
import UserCard from "../components/UserCard";
import { Roles, User } from "../utils/types";
import ModalUser, { CreateNewUSer } from "../components/ModalUser";
import { useSelector } from "react-redux";

const UsersPage = () => {
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<Omit<User, 'accessToken'>[]>([]);
    const userLoggedIn = useSelector((state: any) => state.user.user) as User;
    const accessToken = userLoggedIn.accessToken;
    const newUser: Partial<CreateNewUSer> = { email: '',  firstName: '', id: 0, lastName: '', role: Roles.STUDENT, password: '' }
    const [updatedUser, setUpdatedUser] = useState<Partial<CreateNewUSer>>(newUser);

    const fetchUsers = async () => {
        const API_URL = import.meta.env.VITE_API_URL;
        const response  = await fetch(API_URL + '/user/all', {
            headers: { Authorization: 'Bearer ' + accessToken }
        });
        const data = await response.json();
        setUsers(data);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setUpdatedUser(newUser);
    }

    const addUser = (newUser: Omit<User, 'accessToken'>) => {
        setUsers([...users, newUser]);
        closeModal();
    }

    const removeUser = (userId: number) => {
        setUsers(users.filter(user => user.id !== userId));
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
            <div className="sticky top-0 z-10 mt-3 bg-white shadow-md">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                        <SiteInput
                            value={searchText}
                            onChange={(e) => setSearchText(e)}
                            placeholder="Chercher un utilisateur"
                        />

                    </div>

                    <button
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Ajouter un utilisateur
                    </button>
                </div>
            </div>

            <div className="grid mt-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full px-12 gap-5 mx-auto pb-6">
                {users.map((user) =>
                    <UserCard
                        key={user.id}
                        user={user}
                        onRemoveUser={() => removeUser(user.id)}
                    />
                )}
            </div>

            <ModalUser
                mode="creation"
                isOpen={isModalOpen}
                onClose={closeModal}
                onUpdateUser={addUser}
                user={updatedUser}
            />
        </>
    );
};

export default UsersPage;