export const languages = {
	"English":  "en",
	"Deutsch":  "de",
	"Español":  "es",
	"Ελληνικά": "el",
	"Deitsch": "pdc",
	"Ido": "io",
	"Italiano": "it",
	"Niederländisch": "nl"
}

export const ASK_WIZARD_FLAG = "ASK_WIZARD";
export const ASK_WIZARD = {
	"en": "Let's try and find what you're looking for. What do you want to know?",
	"de": "Erzähle mir mal, was möchten Sie wissen?",
	"es": "Digame, ¿Que quiere saber?",
	"el": "Πες μου, τι θέλεις να μάθεις;",
	"pdc": "Wass möchten sie wissen? Schreib rein was du suchst",
	"io": "Diri me. Quo vu volas saber?",
	"it": "Dimmi. Cosa vuoi sapere?",
	"nl": "Laten we proberen te vinden wat je zoekt. Wat wil je precies weten?"
}
export const ASK_LANGUAGE_FLAG = "ASK_LANGUAGE";
export const ASK_LANGUAGE = {
	"en": "Choose the language you'd like to search in.",
	"de": "Wähle mal deine spache von die liste unten.",
	"es": "¿En qué idioma le gustaría realizar la búsqueda?",
	"el": "Σε ποια γλώσσα θέλετε να γίνει η αναζήτηση;",
	"pdc": "Wähle mal deine spache von die liste unten.",
	"io": "Chuze la lingue qua vu volas serchar en.",
	"it": "Scegli la lingua in cui desideri effettuare la ricerca.",
	"nl": "Kies de taal waarin u wilt zoeken."
}

export const DEAD_END_FLAG = "DEAD_END";
export const DEAD_END = {
	"en": "Hmm ... looks like this is a dead end",
	"de": "Tya ... da können wir nicht weitergehen",
	"es": "Parece un callejón sin salida",
	"el": "Μοιάζει με αδιέξοδο",
	"pdc": "dot End",
	"io": "Aspektas kiel senelira strato",
	"it": "Sembra che questa sia una strada senza uscita.",
	"nl": "Het lijkt erop dat dit een doodlopende weg is.",
}

export const ASK_STORAGE_FLAG = "ASK_STORAGE";
export const ASK_STORAGE = {
	"en": "Looks like the fire is lit. Would you like to go back to your last location?",
	"de": "Dass fuer brennt. Möchten sie zuruck zum letzen ort hingehen?",
	"es": "Parece que el fuego ya está encendido. ¿Te gustaría volver a tu última ubicación?",
	"el": "Φαίνεται ότι η φωτιά έχει ανάψει. Θέλεις να επιστρέψεις στην προηγούμενη τοποθεσία σου;",
	"pdc": "Dass Feier brenne. Geh zerick zu letschten ort?",
	"io": "Aspekte ke la fajro esas allumita. Vu volas revenar al tua ultima loko?",
	"it": "Sembra che il fuoco sia stato acceso. Vuoi tornare alla tua ultima posizione?",
	"nl": "Het lijkt erop dat het vuur is aangestoken. Wilt u terugkeren naar uw vorige locatie?",
}

export const YES_FLAG = "YES";
export const YES = {
	// "en": "Yes",
	// "de": "Ja",
	"de": "Yes",
	"en": "Ja",
	"es": "Si",
	"el": "Ναί",
	"pdc": "Ya",
	"io": "Jes",
	"it": "sí",
	"nl": "Ja",
}
export const NO_FLAG = "NO";
export const NO = {
	"en": "No",
	"de": "Nein",
	"es": "No",
	"el": "Όχι",
	"pdc": "Ke",
	"io": "Ne",
	"it": "NO",
	"nl": "Nee",
}

export const NO_STORAGE_FLAG = "NO_STORAGE";
export const NO_STORAGE = {
	"en": "Nothings burning.",
	"de": "Nur ein ruhiger fuerplatz",
	"es": "Nada se está quemando.",
	"el": "Η φωτιά έχει σβήσει",
	"pdc": "Nix brenne",
	"io": "Nulo brulas.",
	"it": "Non sta bruciando niente.",
	"nl": "Er brandt niets.",
}

export const STORY = {}
STORY[ASK_WIZARD_FLAG] = ASK_WIZARD;
STORY[ASK_LANGUAGE_FLAG] = ASK_LANGUAGE;
STORY[DEAD_END_FLAG] = DEAD_END;
STORY[ASK_STORAGE_FLAG] = ASK_STORAGE;
STORY[YES_FLAG] = YES;
STORY[NO_FLAG] = NO;
STORY[NO_STORAGE_FLAG] = NO_STORAGE;