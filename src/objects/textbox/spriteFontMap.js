// WIDTHS
const DEFAULT_WIDTH = 5;
const width = new Map();

export const CHARACTER_ROWS = 14;
export const CHARACTER_COLUMNS = 14;

// supported characters
export const SUPPORTED_CHARACTERS = [
	"abcdefghijklmnopqrstuvwxyz",
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	"0123456789 ",
	".!-+\\/,?'|:;(){}[]⬤▶*\"„&_%~$#",
	"ß",         				 // German Characters
	"ñÑ¡¿",         			 // Spanish Characters
	"áéíóúÁÉÍÓÚ",				 // Accent Acute Characters
	"àèìòùÀÈÌÒÙ",   			 // Accent Grave Characters
	"âêîôûÂÊÎÔÛ",   			 // Accent Circumflex Characters
	"äëïöüÿÄËÏÖÜŸ",   			 // Accent Diaeresis Characters
	"άέήίύόώ", 					 // Greek Lowercase Tonos
	"Έ",					     // Greek Uppsercase Tonos
	"αβγδεζηθικλμνξοπρσςτυφχψω", // Greek Characters Lowercase
	"ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ",  // Greek Characters Uppercase
].join("");


export const TRANSFERRED_CHARACTERS = {
	"\n": " ",
	"\t": " ",
	"–": "-",
	"—": "-",
	"”": "\"",
	"“": "\"",
	"’": "'",
};

// Add Overrides as needed
width.set("c", 4);
width.set("f", 4);
width.set("i", 2);
width.set("î", 2);
width.set("ï", 2);
width.set("í", 2);
width.set("ì", 2);
width.set("j", 4);
width.set("l", 3);
width.set("n", 4);
width.set("r", 4);
width.set("t", 4);
width.set("u", 4);
width.set("û", 4);
width.set("ü", 4);
width.set("ù", 4);
width.set("ú", 4);
width.set("v", 4);
width.set("x", 4);
width.set("y", 4);
width.set("ÿ", 4);
width.set("z", 4);

width.set("E", 4);
width.set("È", 4);
width.set("É", 4);
width.set("Ê", 4);
width.set("Ë", 4);
width.set("F", 4);
width.set("M", 7);
width.set("W", 7);

width.set(" ", 3);
width.set("'", 2);
width.set("„", 3);
width.set("!", 1);
width.set("|", 1);


width.set("ñ", 4);
width.set("¡", 1);

// all greek letters 
const GREEK_START = 140;
const GREEK_END = 199;
const GREEK_SKIP = ["ι", "τ"]
for (let i = GREEK_START; i < GREEK_END; i ++) {
	if (GREEK_SKIP.indexOf(SUPPORTED_CHARACTERS[i]) != -1) {
		continue;
	}
	width.set(SUPPORTED_CHARACTERS[i], 8);
}

export const getCharacterWidth = (char) => {
	return width.get(char) ?? DEFAULT_WIDTH;
}

// FRAMES
const frame = new Map();
SUPPORTED_CHARACTERS.split("").forEach((char, index) => {
	frame.set(char, index);
});

export const getCharacterFrame = (char) => {
	if (TRANSFERRED_CHARACTERS[char] !== undefined) {
		char = TRANSFERRED_CHARACTERS[char];
	}
	return frame.get(char) ?? 0;
}


