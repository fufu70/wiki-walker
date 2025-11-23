
export class ArrayFactory {
	static removeDuplicates(arr) {
		let duplicateIndexes = [];
		for (let i = 0; i < arr.length; i ++) {
			let duplicates = ArrayFactory.findDuplicates(arr, i);
			duplicateIndexes = duplicateIndexes.concat(duplicates);
		}
		const uniqueArr = [];
		for (let i = 0; i < arr.length; i ++) {
			if (duplicateIndexes.indexOf(i) > -1) {
				continue;
			}
			uniqueArr.push(arr[i]);
		}
		return uniqueArr;
	}

	static findDuplicates(arr, i) {
		let duplicates = [];

		for (let j = i + 1; j < arr.length; j ++) {
			if (ArrayFactory.isDuplicate(arr[i], arr[j])) {
				duplicates.push(j);
			}
		}
		return duplicates;
	}


	static isDuplicate(a, b) {
		return JSON.stringify(a) == JSON.stringify(b);
	}
}