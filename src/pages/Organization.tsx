import { useEffect, useState } from "react";
import { Organization, User } from "../utils/types";
import CreateOrganizationModal from "../components/CreateOrganizationForm";
import { PencilSquareIcon, PlusIcon, TrashIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";

const OrganizationPage = () => {
    const [organizations, setOrganizations] = useState<Organization[] | undefined>(undefined);
    const [users, setUsers] = useState<Omit<User, "accessToken">[] | undefined>(undefined);
    const [isModalCreationOpen, setIsModalCreationOpen] = useState<boolean>(false);
    const [organizationDescribedId, setOrganizationDescribedId] = useState<number>(-1);
    const [updatedOrganizationId, setUpdatedOrganizationId] = useState<number | undefined>(undefined);
    const accessToken = import.meta.env.VITE_ACCESS_TOKEN_ADMIN;
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchUsers = async () => {
        const headers = { Authorization: 'Bearer ' + accessToken };
        const response = await fetch(API_URL + '/user/all', { headers });
        const data = await response.json();
        setUsers(data);
    }

    const fetchOrganizations = async () => {
        const headers = { Authorization: 'Bearer ' + accessToken };
        const response = await fetch(API_URL + '/organization', { headers });
        const data = await response.json();
        setOrganizationDescribedId(data[0].id)
        setOrganizations(data);
    }

    const fetchAllInformations = async () => {
        await Promise.all([fetchOrganizations(), fetchUsers()])
    }

    const toggleUserPresenceInOrganization = async (userId: number) => {
        const organization = organizations!.find(org => org.id === organizationDescribedId);
        let members;

        if (isUserOnOrganization(userId)) {
            members = organization!.users
                .filter(user => user.id !== userId)
        } else {
            const newUser = users!.find(user => user.id === userId);
            members = [...organization!.users, newUser!];
        }

        setOrganizations(prev => {
            const updatedOrganizations = prev!.map(org => {
                if (org.id === organizationDescribedId) return { ...org, users: members };
                return org;
            });
            return updatedOrganizations;
        });

        updateOrganization({ memberIds: members.map(user => user.id) }, organizationDescribedId)
    }

    useEffect(() => {
        fetchAllInformations();
    }, []);

    const isUserOnOrganization = (userId: number) => {
        if (!organizations) return false;

        const organization = organizations.find(org => org.id === organizationDescribedId);
        if (!organization) return false;

        const userFoundInOrganization = organization.users.find((user) => user.id === userId);
        return !!userFoundInOrganization;
    }

    const addOrganization = (newOrganization: Organization) => {
        if (!organizations) return;

        setOrganizations([...organizations, newOrganization])
        setIsModalCreationOpen(false);
    }

    const updateOrganization = async (updatedOrganization: any, organizationId: number) => {
        try {
            const requestOptions = {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: 'Bearer ' + accessToken,
                },
                method: "PUT",
                body: JSON.stringify(updatedOrganization)
            }
            await fetch(`${API_URL}/organization/${organizationId}`, requestOptions);
        } catch (err) {
            console.error(err);
        }
    }

    const deleteOrganization = async (event: any, organizationId: number) => {
        event.stopPropagation();
        if (!organizations) return;
        const allOthersOrganization = organizations.filter((org) => org.id !== organizationId);

        if (organizationId === organizationDescribedId) {
            setOrganizationDescribedId(allOthersOrganization[0].id);
        }

        const requestOptions = {
            headers: { Authorization: 'Bearer ' + accessToken },
            method: "DELETE"
        };
        await fetch(`${API_URL}/organization/${organizationId}`, requestOptions);
        setOrganizations(allOthersOrganization);
    }

    const triggerClickOnOrganizationEdit = (organizationId: number) => {
        setUpdatedOrganizationId(organizationId);
        setIsModalCreationOpen(true)
    }

    const handleOrganizationNameUpdate = (newOrganization: Organization, organizationId: number) => {
        if (!organizations) return;

        setUpdatedOrganizationId(undefined);
        setIsModalCreationOpen(false);
        setOrganizations(prev => {
            const updatedOrganizations = prev!.map(org => {
                if (org.id === organizationId) return { ...org, name: newOrganization.name };
                return org;
            });
            return updatedOrganizations;
        })
    }

    return (
        <>
            {organizations && users ? <div className="h-screen flex">
                <div className="w-1/2 overflow-y-scroll bg-gray-100">
                    <ul className="p-4 space-y-2">
                        {organizations.map((org) => (
                            <li
                                key={`org-${org.id}`}
                                className={`py-2 px-4 shadow rounded cursor-pointer flex gap-x-3 ${org.id === organizationDescribedId
                                    ? "bg-blue-600 text-white"
                                    : "bg-white"
                                    }`}
                                onClick={() => setOrganizationDescribedId(org.id)}
                            >
                                <UserGroupIcon className="h-6 w-6 shrink-0" />
                                {org.name}
                                <div className="ml-auto flex gap-3">
                                    <PencilSquareIcon
                                        onClick={() => triggerClickOnOrganizationEdit(org.id)}
                                        className="h-6 w-6"
                                    />
                                    <TrashIcon
                                        className="h-6 w-6 text-red-600 ml-auto"
                                        onClick={(event) => deleteOrganization(event, org.id)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-1/2 overflow-y-scroll bg-gray-200">
                    <ul className="p-4 space-y-2">
                        {users.map((user) => (
                            <li
                                key={`org-${user.id}`}
                                className={`py-2 px-4 shadow rounded cursor-pointer flex gap-x-3 ${isUserOnOrganization(user.id)
                                    ? "bg-blue-600 text-white"
                                    : "bg-white"
                                    }`}
                                onClick={() => toggleUserPresenceInOrganization(user.id)}
                            >
                                <UserIcon className="h-6 w-6 shrink-0" />
                                {user.firstName + ' ' + user.firstName.toUpperCase() + ', ' + user.role.toUpperCase()}
                            </li>
                        ))}
                    </ul>
                </div>
            </div> : null}

            <div
                className="fixed bottom-10 right-10 size-14 rounded-full bg-green-600 flex items-center justify-center cursor-pointer"
                onClick={() => setIsModalCreationOpen(true)}
            >
                <PlusIcon className="size-10 text-white" />
            </div>

            <CreateOrganizationModal
                isOpen={isModalCreationOpen}
                onClose={() => setIsModalCreationOpen(false)}
                onOrganizationCreate={addOrganization}
                mode={!!updatedOrganizationId ? 'edition' : 'creation'}
                onOrganizationUpdate={handleOrganizationNameUpdate}
                updatedOrganizationId={updatedOrganizationId}
            />
        </>
    );
};

export default OrganizationPage;