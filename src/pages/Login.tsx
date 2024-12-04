import React, { useState, useRef } from "react";
import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import { updateUser } from '../context/User';
import { Roles, User } from "../utils/types";
import { useNavigate } from "react-router-dom";
import Notification, { NotificationRef } from "../components/SiteNotifications";
import { XCircleIcon } from "@heroicons/react/24/outline";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationInformations, setNotificationInformations] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const notificationRef = useRef<NotificationRef>(null);

    const showNotification = () => {
        if (notificationRef.current) {
            notificationRef.current.openNotifications();
        }
    };

    const fetchProfile = async (accessToken: string) => {
        const profileRequest = await fetch(apiUrl + '/user/profile', { headers: { Authorization: 'Bearer ' + accessToken } } );
        const profile = await profileRequest.json();
        if(!profileRequest.ok) throw new Error(profile.message);
        return profile;
    }

    const navigateToGoodPage = (role: Roles) => {
        if(role === Roles.STUDENT) {
            return navigate('/to-fill');
        } else {
            return navigate('/forms');
        }
    }

    const fetchLogin = async () => {
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" }
        };

        const response = await fetch(apiUrl + '/user/login', requestOptions);
        const informations = await response.json();
        if(!response.ok) throw new Error(informations.message);

        const {accessToken} = informations;
        return accessToken as string;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const accessToken = await fetchLogin()

            const profile: Omit<User, "accessToken"> = await fetchProfile(accessToken);
            dispatch(updateUser({ ...profile, accessToken }));

            return navigateToGoodPage(profile.role);
        } catch {
            setNotificationTitle("Error")
            setNotificationInformations("An error has occured when trying to log in");
            showNotification();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-14 w-auto"
                    src="/Logo SurvEfrei.png"
                    alt="Your Company"
                />

                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            {isLoading && <Loader />}
            <Notification
                ref={notificationRef}
                title={notificationTitle}
                information={notificationInformations}
            >
                <XCircleIcon className="h-6 w-6 text-red-600" />
            </Notification>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    className="space-y-6"
                    method="POST"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm/6 font-medium text-gray-900"
                        >
                            Email address
                        </label>

                        <div className="mt-2">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm/6 font-medium text-gray-900"
                            >
                                Password
                            </label>

                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div className="mt-2">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
