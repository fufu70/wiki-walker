import {ORIENTATIONS} from './Orientation.js';
import {OUTLINES} from './Outlines.js';

export class OrientationFactory {

	static getOrientation(x, y, floorPlan) {
		return new OrientationFactory().findOrientations(x, y, floorPlan)[0];
	}

	static getOrientations(x, y, floorPlan) {
		return new OrientationFactory().findOrientations(x, y, floorPlan);
	}

	findOrientations(x, y, floorPlan) {
		return ORIENTATIONS.reduce((acc, orientation) => {
			if (this.matchMatrixes(x, y, floorPlan, OUTLINES[orientation])) {
				acc.push(orientation);
			};
			return acc;
		}, []);
	}

	matchMatrixes(x, y, floorPlan, matrixes) {
		const fpMatrixExtract = floorPlan.neighborContrast(x, y);


		for (let i = 0; i < matrixes.length; i ++) {
			const matrix = matrixes[i];
			if (matrix.matches(fpMatrixExtract)) {
				return true;
			}
		}
		return false;
	}

	static getExtractedOrientation(extractedNeighbors) {
		return new OrientationFactory().findExtractedOrientations(extractedNeighbors)[0];
	}

	static getExtractedOrientations(extractedNeighbors) {
		return new OrientationFactory().findExtractedOrientations(extractedNeighbors);
	}

	findExtractedOrientations(extractedNeighbors) {
		return ORIENTATIONS.reduce((acc, orientation) => {
			if (this.matchExtractedMatrixes(extractedNeighbors, OUTLINES[orientation])) {
				acc.push(orientation);
			};
			return acc;
		}, []);
	}

	matchExtractedMatrixes(extractedNeighbors, matrixes) {

		for (let i = 0; i < matrixes.length; i ++) {
			const matrix = matrixes[i];
			if (matrix.matches(extractedNeighbors)) {
				return true;
			}
		}
		return false;
	}
}

