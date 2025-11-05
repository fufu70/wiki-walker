
export const SKIP = -1;
export const EMPTY = 0;

export class Matrix {

	constructor(matrix = {}) {
		if (Object.keys(matrix).indexOf('matrix') > -1) {
			this.matrix = matrix.matrix;
			this._locations = matrix._locations;
		} else {
			this.matrix = matrix;
		}
		this._yStart = this.yStart();
		this._xStart = this.xStart();
		this._width = this.width();
		this._height = this.height();
		this.neighborCache = new Map();
		this._locations = this.locations();
	}

	add(x, y, value) {
		if (!this.matrix[y]) {
			this.matrix[y] = {};
		}

		this.matrix[y][x] = value;
		this._locations.push({x, y});
		this.clearSize();
	}

	clearSize() {
		this._xStart = undefined;
		this._yStart = undefined;
		this._width = undefined;
		this._height = undefined;
	}

	get(x, y) {
		if (!this.matrix[y] || !this.matrix[y][x]) {
			return EMPTY;
		}
		return this.matrix[y][x];
	}

	width() {
		if (this._width !== undefined) {
			return this._width;	
		}
		const a = this.calculateWidth();
		this._width = a;
		return a;
	}

	calculateWidth() {
		let max = 0;
		for (let a = this.yStart(); a < this.height(); a ++) {
			if (this.matrix[a] === undefined) {
				break;
			}
			const rowMax = Object.keys(this.matrix[a]).reduce((curr, next) => {
				curr = Number(curr);
				next = Number(next);
				if (curr > next) {
				    return curr;
				}
				return next;
			}, 0);
			if (rowMax > max) {
				max = rowMax;
			}
		}

		return max + 1;
	}

	height() {
		if (this._height !== undefined) {
			return this._height;	
		}
		const a = this.calculateHeight();
		this._height = a;
		return a;
	}

	calculateHeight() {
		return Object.keys(this.matrix).length;
	}

	xStart() {
		if (this._xStart !== undefined) {
			return this._xStart;
		}
		const a = this.calculateXStart();
		this._xStart = a;
		return this._xStart;
	}

	calculateXStart() {
		let min = 0;
		Object.keys(this.matrix).forEach(y => {
			let tempMin = Math.min(...Object.keys(this.matrix[y]));
			if (tempMin < min) {
				min = tempMin;
			}
		})
		return min;
	}

	yStart() {
		if (this._yStart !== undefined) {
			return this._yStart;
		}
		const a = this.calculateYStart();
		this._yStart = a;
		return this._yStart;
	}

	calculateYStart() {
		return Math.min(...Object.keys(this.matrix));
	}

	matches(b) {
		for (let y = this.yStart(); y < this.height(); y ++) {
			for (let x = this.xStart(); x < this.width(); x ++) {
				if (this.get(x,y) === SKIP || b.get(x,y) === SKIP) {
					continue;
				}

				if (this.get(x,y) !== b.get(x,y)) {
					return false;
				}
			}
		}
		return true;
	}

	traverse({callback, callbackEachRow, padding, extractionSize}) {
		if (padding === undefined) {
			padding = 0;
		}
		for (let y = this.yStart() - padding; y < this.height() + padding; y ++) {
			for (let x = this.xStart() - padding; x < this.width() + padding; x ++) {
				callback(x, y, this.get(x, y));
			}
			if (callbackEachRow !== undefined) {
				callbackEachRow(y);	
			}
		}
	}

	neighborContrast(x, y) {
		const key = x+'-'+ y;
		if (this.neighborCache.has(key)) {
			return this.neighborCache.get(key);
		}
		const neighborContrast = this.extract(x - 1, y - 1, 3, 3).compare(0)
		this.neighborCache.set(key, neighborContrast);
		return neighborContrast;
	}

	compare(compareValue) {
		let m = new Matrix([]);

		this.traverse({
			callback: (x, y, matrixValue) => {
				if (matrixValue === compareValue) {
					m.add(x, y, 0);
				} else if (matrixValue > compareValue) {
					m.add(x, y, 1);
				} else if (matrixValue < compareValue) {
					m.add(x, y, -1);
				}
			}
		})
		return m;
	}

	extract(x, y, width, height) {
		let m = new Matrix({});

		for (let i = 0; i < width; i ++) {
			for (let j = 0; j < height; j ++) {
				// console.log(i, j, x+i, y+j, "is " + this.get(x + i, y + j))
				// console.log(i, j, x+i, y+j, "is " + this.get(y + j, x + i))
				m.add(i, j, this.get(x + i, y + j));
			}
		}
		// console.log(m.toString())
		return m;
	}

	toString() {
		let str = new String();

		this.traverse({
			callback: (x, y, value) => {
				str += String.fromCharCode(9) + this.get(x, y)
			},
			callbackEachRow: (y) => {
				str += String.fromCharCode(10);
			}
		});

		return str;
	}

	locations() {
		if (this._locations !== undefined) {
			return this._locations;
		}
		const a = this.calculateLocations();
		this._locations = a;
		return this._locations;
	}

	calculateLocations() {
		let locs = [];

		this.traverse({
			callback: (x, y, value) => {
				if (value > EMPTY) {
					locs.push({x, y});
				}
			}
		});

		return locs;
	}
}

/**
 * TESTING
 */
console.assert(new Matrix([
	[0,0],
	[1,1],
	[2,2]
]).width() == 2, "Width should be 2")

console.assert(new Matrix([
	[0,0],
	[1,1],
	[2,2]
]).height() == 3, "Height should be 3")


console.assert(new Matrix([
	[-1,-1],
	[ 1, 1],
	[ 2, 2]
]).get(1, 2) === 2, "an x y of 1, 2 should be 2");

console.assert(new Matrix([
	[-1,-1],
	[ 1, 1],
	[ 2, 2]
]).get(4, 5) === EMPTY, "an x y coordinate that does not exist should be empty");

console.assert(new Matrix([
	[5, 5, 5],
	[5,-1, 4],
	[5, 4,12],
]).matches(new Matrix([
	[5, 5, 5],
	[5, 7, 4],
	[5, 4,-1]
])), "values that are -1 should be skipped when matching");

console.assert(new Matrix([
	[5, 5, 5],
	[5, 1, 4],
	[5, 4,12],
]).matches(new Matrix([
	[5, 5, 5],
	[5, 7, 4],
	[5, 4, 1]
])) === false, "If matrixes are different then they should not match");

console.assert(new Matrix([
	[5, 5, 5],
	[5, 4, 4],
	[5, 4, 3],
]).matches(new Matrix([
	[5, 5, 5],
	[5, 4, 4],
	[5, 4, 3]
])), "Two matrixes that are the same shape and content should match");

console.assert(new Matrix([
	[5, 5, 5],
	[5, 4, 4],
	[5, 4, 3],
]).compare(4).matches(new Matrix([
	[1, 1, 1],
	[1, 0, 0],
	[1, 0,-1]
])), "Compare should show if a matrix value is less than or greater than the provided value");

console.assert(new Matrix([
	[5, 5, 5, 5, 5],
	[5, 4, 4, 4, 5],
	[5, 4, 3, 4, 5],
	[5, 4, 4, 4, 5],
	[5, 5, 5, 5, 5],
]).extract(0, 0, 3, 3).matches(new Matrix([
	[5, 5, 5],
	[5, 4, 4],
	[5, 4, 3]
])), "An extraction at the root should match");


console.assert(new Matrix([
	[ 0, 1, 2, 3, 4],
	[ 5, 4, 3, 2, 1],
	[ 7, 8, 9,12,11],
	[52,74,53,21,31],
	[59,64,93,32,41],
]).extract(1, 1, 3, 3).matches(new Matrix([
	[ 4, 3, 2],
	[ 8, 9,12],
	[74,53,21]
])), "An extraction at the root should match");


console.assert(new Matrix([
	[0,0],
	[1,1],
	[0,0]
]).locations().length == 2, "Locations should be 2");

let locations = new Matrix([
	[0,0],
	[1,1],
	[0,0]
]).locations();

console.assert(locations[0].x == 0 && locations[0].y == 1, "Location 0 should be 0,1");
console.assert(locations[1].x == 1 && locations[1].y == 1, "Location 1 should be 1,1");