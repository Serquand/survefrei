import { Answer, SurveyFieldType } from '../utils/types';
import DensityChart from './DensityChart';
import PieChart from './PieChart';

interface Props {
    answers: Answer[],
    label: string;
    fieldType: SurveyFieldType;
}

const SiteGlobalKPI = (props: Props) => {
    const convertAnswerInOccurenceAnswer = (answers: Answer[]): { label: string; occurrences: number }[] => {
        const occurrencesMap = new Map();
        answers.forEach(answer => {
            const value = answer.value;
            if (occurrencesMap.has(value)) {
                occurrencesMap.set(value, occurrencesMap.get(value) + 1);
            } else {
                occurrencesMap.set(value, 1);
            }
        });
        const occurrences = Array.from(occurrencesMap.entries()).map(([label, occurrences]) => ({ label, occurrences }));
        console.log(occurrences);
        return occurrences;
    }

    return (<>
        {props.fieldType === SurveyFieldType.CHECKBOX || props.fieldType === SurveyFieldType.SELECT ?
            <PieChart
                questionLabel={props.label}
                responsesOccurence={convertAnswerInOccurenceAnswer(props.answers)}
            />
        : null}

        {props.fieldType === SurveyFieldType.NUMBER ?
            <DensityChart

            />
        : null}
    </>)
}

export default SiteGlobalKPI;