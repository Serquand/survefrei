import { useEffect, useState } from "react";
import SiteInput from "../components/SiteInput";
import UserCard from "../components/UserCard";
import { User } from "../utils/types";
import ModalUser from "../components/ModalUser";

const UsersPage = () => {
    const [searchText, setSearchText] = useState("");
    const [users, setUsers] = useState<Omit<User, 'accessToken'>[]>([]);
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVzdGViYW52aW5jZW50Lm1haWxAZ21haWwuY29tIiwidXNlcklkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzI4ODk1ODl9.RA9_ZalRKeQNVG_A6Cc-LIEAPIbCzRxnGniLYQAu9P8';

    const handleSearchChange = (newValue: string) => {
        setSearchText(newValue);
    };

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
                            onChange={handleSearchChange}
                            placeholder="Chercher un utilisateur"
                        />
                        <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
                            Rechercher
                        </button>
                    </div>
                    <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
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
                isOpen={false}
                onClose={() => console.log("Coucou")}
                onUpdateUser={() => console.log("Coucou")}
                user={users[0]}
            /> : null}
        </>
    );
};

export default UsersPage;