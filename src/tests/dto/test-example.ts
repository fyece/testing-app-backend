export const test = {
	"name": "Первый тест",
	"description": "Описание первого теста",
	"questions": [
		{
			"text": "Вопрос 1",
			"type": "single",
			"points": 1,
			"answers": [
				{"text": "Ответ на вопрос 1", "isCorrect": true},
				{"text": "Ответ на вопрос 2", "isCorrect": false},
				{"text": "Ответ на вопрос 3", "isCorrect": false},
				{"text": "Ответ на вопрос 4", "isCorrect": false}
			]
		},
		{
			"text": "Вопрос 2",
			"type": "multiple",
			"points": 2,
			"answers": [
				{"text": "Ответ на множественный вопрос 1", "isCorrect": true},
				{"text": "Ответ на множественный вопрос 2", "isCorrect": false},
				{"text": "Ответ на множественный вопрос 3", "isCorrect": true},
				{"text": "Ответ на множественный вопрос 4", "isCorrect": false}
			]
		},
		{
			"text": "Вопрос 3",
			"type": "text",
			"points": 3,
			"answers": [
				{"text": "Текстовый ответ 1", "isCorrect": true},
				{"text": "Текстовый ответ 2", "isCorrect": true},
				{"text": "Текстовый ответ 3", "isCorrect": true},
				{"text": "Текстовый ответ 4", "isCorrect": true}
			]
		}
	]
}