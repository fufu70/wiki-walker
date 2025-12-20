export const languages = {
	"English":  "en",
	"Deutsch":  "de",
	"Español":  "es",
	"Ελληνικά": "el"
}

export const ASK_WIZARD_FLAG = "ASK_WIZARD";
export const ASK_WIZARD = {
	"en": "Let's try and find what you're looking for. What do you want to know?",
	"de": "Erzähle mir mal, was möchten Sie wissen?",
	"es": "Digame, ¿Que quiere saber?",
	"el": "Πες μου, τι θέλεις να μάθεις;"
}
export const ASK_LANGUAGE_FLAG = "ASK_LANGUAGE";
export const ASK_LANGUAGE = {
	"en": "Choose the language you'd like to search in.",
	"de": "Wähle mal deine spache von die liste unten.",
	"es": "¿En qué idioma le gustaría realizar la búsqueda?",
	"el": "Σε ποια γλώσσα θέλετε να γίνει η αναζήτηση;"
}

export const DEAD_END_FLAG = "DEAD_END";
export const DEAD_END = {
	"en": "Hmm ... looks like this is a dead end",
	"de": "Tya ... da können wir nicht weitergehen",
	"es": "Parece un callejón sin salida",
	"el": "Μοιάζει με αδιέξοδο"
}
export const STORY = {}
STORY[ASK_WIZARD_FLAG] = ASK_WIZARD;
STORY[ASK_LANGUAGE_FLAG] = ASK_LANGUAGE;
STORY[DEAD_END_FLAG] = DEAD_END;