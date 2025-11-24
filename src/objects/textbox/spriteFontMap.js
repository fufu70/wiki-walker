// WIDTHS
const DEFAULT_WIDTH = 5;
const width = new Map();

// supported characters
export const SUPPORTED_CHARACTERS = [
	"abcdefghijklmnopqrstuvwxyz",
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	"0123456789 ",
	".!-+\\/,?'|:;()[]⬤▶*\"&_%~$#",
	"äöüßÄÖÜ",  // German Characters
	"áéíñóú¿¡", // Spanish Characters
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
width.set("j", 4);
width.set("l", 3);
width.set("n", 4);
width.set("r", 4);
width.set("t", 4);
width.set("u", 4);
width.set("v", 4);
width.set("x", 4);
width.set("y", 4);
width.set("z", 4);

width.set("E", 4);
width.set("F", 4);
width.set("M", 7);
width.set("W", 7);

width.set(" ", 3);
width.set("'", 2);
width.set("!", 1);
width.set("|", 1);


width.set("í", 2);
width.set("ñ", 4);
width.set("¡", 1);

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

export const CHARACTER_ROWS = 10;
export const CHARACTER_COLUMNS = 11;