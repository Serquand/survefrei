import { SurveyField, SurveyFieldWithAnswer } from "./types";

export function generateDistinctColors(count: number) {
    const colors = [];
    const saturation = 70;
    const lightness = 50;

    for (let i = 0; i < count; i++) {
        const hue = Math.floor((360 / count) * i);
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
}

export function moveElement(array: SurveyField[], indexFrom: number, indexTo: number): SurveyField[] {
    const newArray = [...array];
    const [movedElement] = newArray.splice(indexFrom, 1);
    newArray.splice(indexTo, 0, movedElement);

    newArray.forEach((item, index) => item.order = index + 1);
    return newArray;
}

export function sendOrderedFields(fields: (SurveyField | SurveyFieldWithAnswer)[]): (SurveyField | SurveyFieldWithAnswer)[] {
    return fields.sort((a, b) => a.order - b.order);
}