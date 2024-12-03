import { useEffect, useState } from "react";
import SiteInput from "../components/SiteInput";
import UserCard from "../components/UserCard";
import { User } from "../utils/types";
import ModalUser from "../components/ModalUser";

const UsersPage = () => {
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<Omit<User, 'accessToken'>[]>([]);
    const accessToken = import.meta.env.VITE_ACCESS_TOKEN_ADMIN;

    const fetchUsers = async () => {
        const API_URL = import.meta.env.VITE_API_URL;
        const response  = await fetch(API_URL + '/user/all', {
            headers: { Authorization: 'Bearer ' + accessToken }
        });
        const data = await response.json();
        setUsers(data);
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
                        fullName={user.firstName + ' ' + user.lastName}
                        email={user.email}
                        id={user.id}
                        role={user.role}
                    />
                )}
            </div>

            {(users && users.length > 0) ? <ModalUser
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdateUser={() => console.log("Coucou")}
                user={users[0]}
            /> : null}
        </>
    );
};

export default UsersPage;