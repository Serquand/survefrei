import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetailedForm = () => {
    const { id } = useParams<{ id: string; }>();
    const [form, setForm] = useState({});
    const API_URL = import.meta.env.VITE_API_URL;
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVzdGViYW52aW5jZW50Lm1haWxAZ21haWwuY29tIiwidXNlcklkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzI4ODk1ODl9.RA9_ZalRKeQNVG_A6Cc-LIEAPIbCzRxnGniLYQAu9P8";

    useEffect(() => {
        const getForm = async () => {
            const headers = { Authorization: 'Bearer ' + accessToken };
            const response = await fetch(API_URL + '/survey/' + id, {headers});
            const data = await response.json();
            setForm(data);
            console.log(data);
        }
        getForm();
    }, []);

    return (
        <h1>Detailed Form - {id} - <pre>{JSON.stringify(form, null, 2)}</pre></h1>
    );
};

export default DetailedForm;