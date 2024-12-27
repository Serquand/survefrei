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

export function calculateMedian(numbers: Array<number>): string {
    const sorted = [...numbers].sort((a, b) => a - b);
    const n = sorted.length;

    if (n % 2 !== 0) {
        const median = sorted[Math.floor(n / 2)];
        return median.toFixed(2);
    }

    const mid1 = n / 2 - 1;
    const mid2 = n / 2;
    const median = (sorted[mid1] + sorted[mid2]) / 2;
    return median.toFixed(2);
}

export function calculateMean(numbers: Array<number>): string {
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / numbers.length;
    return mean.toFixed(2);
}

export function findSearchedArray<T>(initialArray: Array<T> | undefined | null, query: string, key: Array<keyof T>): Array<T> | undefined | null {
    const localArray: Array<T> = [];
    if(query.trim() === '' || !initialArray) return initialArray;
    initialArray.forEach((element) => {
        for(const k of key) {
            if((element[k] as string).toLowerCase().includes(query.toLowerCase())) {
                localArray.push(element);
                return;
            }
        }
    })
    return localArray;
}