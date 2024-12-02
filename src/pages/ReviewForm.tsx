import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ReviewForm = () => {
    const { id: formId } = useParams<{ id: string; }>();
    const [form, setForm] = useState(undefined);
    const API_URL = import.meta.env.VITE_API_URL;
    const ACCESS_TOKEN_STUDENT = import.meta.env.VITE_ACCESS_TOKEN_STUDENT;

    useEffect(() => {
        const getAnswers = async () => {
            const headers = { Authorization: 'Bearer ' + ACCESS_TOKEN_STUDENT }
            const response = await fetch(`${API_URL}/user-answer/${formId}`, { headers });
            const data = await response.json();
            setForm(data);
        }
        getAnswers();
    }, []);

    return (<>
        <pre>{JSON.stringify(form, null, 2)}</pre>
    </>)
}

export default ReviewForm;