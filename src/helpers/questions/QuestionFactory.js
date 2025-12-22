import {QuestionGenerator} from 'study-guide-spanish-english';

export class QuestionFactory {

	static random(seed = undefined) {
		const q = QuestionGenerator.getRandomQuestion();
		return {
			config: {
				string: q.question,
				options: q.answerKey
			},
			isCorrect: (text) => {
				return q.isCorrect(text)
			},
			getResponse: q.getResponse,
			inputType: "SELECT_INPUT"
		}
	}
}