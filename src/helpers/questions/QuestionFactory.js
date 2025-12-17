import {QuestionGenerator} from 'study-guide-spanish-english';

export class QuestionFactory {
	// 
	// {
	// 	config: {
	// 		string: "The idea of self-government is in the first three words of the Constitution. What are these words?"
	// 	},
	// 	inputType: "TEXT_INPUT",
	// 	answers: ["We the People"]
	// },

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