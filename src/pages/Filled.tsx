// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { User } from "../utils/types";
// import SurveyCard from "../components/SurveyCard";

const Filled = () => {
    // const user: User = useSelector(state => state.user.user);
    // const [surveyData, setSurveyData] = useState(null); // to store the survey data

    // useEffect(() => {
    //     const fetchSurveyData = async () => {
    //         try {
    //             const API_URL = import.meta.env.VITE_API_URL;
    //             const headers = { Authorization: "Bearer " + user.accessToken };
    //             const response = await fetch(API_URL + "/survey", { headers });

    //             if (!response.ok) {
    //                 throw new Error(`Failed to fetch survey data: ${response.statusText}`);
    //             }

    //             const data = await response.json();
    //             setSurveyData(data);
    //         } catch (err) {
    //             console.error("Error fetching survey data:", err);
    //         }
    //     };

    //     if (user.accessToken) {
    //         fetchSurveyData();
    //     }
    // }, [user]);

    return (
        <div>
            <div>Caca</div>
        </div>
    );
};

export default Filled;
