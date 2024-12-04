// @ts-nocheck

import { useState } from "react";
import { SurveyFieldType, SurveyField as SurveyFieldInterface } from "../utils/types";
import InputField from "./SiteGlobalInput";
import SiteSelect from "./SiteSelect";
import SiteCheckbox from "./SiteCheckbox";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Props {
    field: SurveyFieldInterface;
    numberOfFields: number;
    currentPlaceOfField: number;
    surveyId: number;
    onDeleteField: () => void;
    onUpdatePosition: (newPosition: number) => void;
    onUpdateField: (newField: SurveyFieldInterface) => void;
}

const SurveyFieldBuilder = (props: Props) => {
    const [value, setValue] = useState(props.field);
    const debounceTimeMs = 2_500;
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
    const API_URL = import.meta.env.VITE_API_URL;

    const fieldTypeOptions = [
        { id: SurveyFieldType.CHECKBOX, label: "Case à cocher" },
        { id: SurveyFieldType.NUMBER, label: "Nombre" },
        { id: SurveyFieldType.SELECT, label: "Liste déroulante" },
        { id: SurveyFieldType.TEXT, label: "Texte" },
        { id: SurveyFieldType.TEXTAREA, label: "Paragraphe" },
    ];

    const positionOptions = Array.from(new Array(props.numberOfFields)).map((_, index) => ({
        id: index + 1,
        label: '' + (index + 1),
    }));

    const updateFieldValue = (key: keyof SurveyFieldInterface, newValue: any) => {
        setValue((prevState) => {
            const newState = { ...prevState, [key]: newValue };
            return newState;
        });
    };

    const handleOnBlur = (key: keyof SurveyFieldInterface) => {
        setDebounceToSaveField(value);
        props.onUpdateField(value);
    }

    const saveField = async (fieldToSave: SurveyFieldInterface) => {
        const accessToken = import.meta.env.VITE_ACCESS_TOKEN_ADMIN;
        const { id, formId, answers, ...newField } = fieldToSave;
        const choicesToSave = fieldToSave.choices.map(choice => ({ label: choice.label }));
        const requestOptions = {
            headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify({ ...newField, choices: choicesToSave }),
        };
        await fetch(`${API_URL}/survey/${props.surveyId}/field/${props.field.id}`, requestOptions);
    };

    const setDebounceToSaveField = (fieldToSave: SurveyFieldInterface) => {
        if (saveTimeout) clearTimeout(saveTimeout);

        const timeout = setTimeout(() => saveField(fieldToSave), debounceTimeMs);
        setSaveTimeout(timeout);

        return () => {
            if (saveTimeout) clearTimeout(saveTimeout);
        };
    }

    const updateChoices = (newChoice: string, choiceIndex: number) => {
        setValue((prevState) => {
            return {
                ...prevState,
                choices: prevState.choices.map((choice, index) => (index === choiceIndex ? { label: newChoice } : choice))
            };
        });
    };

    const deleteField = async () => {
        const accessToken = import.meta.env.VITE_ACCESS_TOKEN_ADMIN;
        const requestOptions = {
            headers: { Authorization: `Bearer ${accessToken}` },
            method: "DELETE",
        };
        await fetch(`${API_URL}/survey/${props.surveyId}/field/${props.field.id}`, requestOptions);
        props.onDeleteField();
    };

    return (
        <div className="mx-auto flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
                <InputField
                    modelValue={value.label}
                    onUpdate={(e) => updateFieldValue("label", e)}
                    onBlur={handleOnBlur}
                    id={`field-${props.field.id}-label`}
                    type="text"
                    required={true}
                    label="Nom du champ"
                    disabled={false}
                />

                <SiteSelect
                    options={fieldTypeOptions}
                    modelValue={value.fieldType}
                    onUpdate={(value) => updateFieldValue("fieldType", value)}
                    onBlur={handleOnBlur}
                    label="Type du champ"
                />

                {value.fieldType === SurveyFieldType.NUMBER && (
                    <>
                        <InputField
                            modelValue={value.minValue}
                            onUpdate={(e) => updateFieldValue("minValue", e)}
                            onBlur={handleOnBlur}
                            id={`field-${props.field.id}-min-value`}
                            type="number"
                            required={true}
                            label="Valeur minimale"
                            disabled={false}
                        />
                        <InputField
                            modelValue={value.maxValue}
                            onUpdate={(e) => updateFieldValue("maxValue", e)}
                            onBlur={handleOnBlur}
                            id={`field-${props.field.id}-max-value`}
                            type="number"
                            required={true}
                            label="Valeur maximale"
                            disabled={false}
                        />
                    </>
                )}

                {value.fieldType === SurveyFieldType.SELECT && (
                    <div className="flex flex-col gap-4">
                        {value.choices.map((_, index) => (
                            <div className="flex items-end gap-4" key={index}>
                                <div className="grow">
                                    <InputField
                                        modelValue={value.choices[index].label}
                                        onUpdate={(value) => updateChoices(value + "", index)}
                                        onBlur={handleOnBlur}
                                        type="text"
                                        id={`field-${value.id}-choice-${index}`}
                                        label={`Choix ${index + 1}`}
                                    />
                                </div>
                                <TrashIcon
                                    className="size-6 mb-2 text-red-600 cursor-pointer"
                                    onClick={() => {
                                        const updatedChoices = value.choices.filter((_, i) => i !== index);
                                        updateFieldValue("choices", updatedChoices);
                                    }}
                                />
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => updateFieldValue("choices", [...value.choices, { label: "Choix " + (value.choices.length + 1) }])}
                            className="text-green-600 hover:text-green-800 mt-4"
                        >
                            Ajouter une réponse
                        </button>
                    </div>
                )}

                {value.fieldType === SurveyFieldType.SELECT && (
                    <InputField
                        modelValue={value.maximalNumberOfChoices}
                        onUpdate={(e) => updateFieldValue("maximalNumberOfChoices", e)}
                        onBlur={handleOnBlur}
                        id={`field-${props.field.id}-max-number-of-choices`}
                        type="number"
                        required={true}
                        label="Nombre maximum de réponses"
                        disabled={false}
                    />
                )}
            </div>

            <div className="ml-auto w-fit flex items-center gap-6">
                <div className="flex gap-2 items-center">
                    <p>Position :</p>
                    <SiteSelect
                        options={positionOptions}
                        modelValue={props.currentPlaceOfField}
                        onUpdate={(value) => props.onUpdatePosition(value)}
                        nativeSelect={true}
                    />
                </div>

                <SiteCheckbox
                    id="1"
                    onUpdate={(value) => updateFieldValue("required", value)}
                    label="Champ requis"
                    modelValue={value.required}
                />

                <TrashIcon className="size-6 cursor-pointer text-red-600" onClick={deleteField} />
            </div>
        </div>
    );
};

export default SurveyFieldBuilder;
