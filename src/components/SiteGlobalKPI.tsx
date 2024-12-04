import { isEmpty } from 'lodash';
import { Answer, SurveyFieldType } from '../utils/types';
import DensityChart from './DensityChart';
import PieChart from './PieChart';
import InputField from './SiteGlobalInput';

interface Props {
    answers: Answer[],
    label: string;
    fieldType: SurveyFieldType;
    minValue: number;
    maxValue: number;
}

const SiteGlobalKPI = (props: Props) => {
    const convertAnswerInOccurenceAnswer = (answers: Answer[]): { label: string; occurrences: number }[] => {
        const occurrencesMap = new Map();
        answers
            .map((answer) => answer.value)
            .flat()
            .forEach(value => {
                if (occurrencesMap.has(value)) {
                    occurrencesMap.set(value, occurrencesMap.get(value) + 1);
                } else {
                    occurrencesMap.set(value, 1);
                }
            });
        return Array.from(occurrencesMap.entries()).map(([label, occurrences]) => ({ label, occurrences }));
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
                numbers={props.answers.map(answer => answer.value as number)}
                maxValue={props.maxValue}
                minValue={props.minValue}
            />
            : null}

        <div className='flex flex-col gap-4'>
            {(props.fieldType === SurveyFieldType.TEXT || props.fieldType === SurveyFieldType.TEXTAREA) &&
                props.answers.map((answer, index) =>
                    !isEmpty(answer) && (
                        <InputField
                            modelValue={answer.valueText}
                            id={`answer-to${answer.questionId}-number-${index}`}
                            disabled={true}
                            key={index}
                            type={props.fieldType === SurveyFieldType.TEXT ? 'text' : 'textarea'}
                        />
                    )
                )
            }
        </div>
    </>)
}

export default SiteGlobalKPI;