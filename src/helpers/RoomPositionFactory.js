export class RoomPositionFactory {
	
	static getRoomPositions(subjectivePositions, getSize, xIncrement = 1) {

		const objectPositions = subjectivePositions.reduce((accu, value, index) => {
			const positionSize = getSize(index);
			value = accu.reduce((position, accuVal) => {
				const objectSize = getSize(accuVal.index);
				const accuValMinX = accuVal.position.x;
				const accuValMinY = accuVal.position.y;
				const accuValMaxX = objectSize.x + accuVal.position.x;
				const accuValMaxY = objectSize.y + accuVal.position.y;


				const valueMinX = position.x;
				const valueMinY = position.y;
				const valueMaxX = positionSize.x + position.x;
				const valueMaxY = positionSize.y + position.y;

				if ((position.x >= accuValMinX && position.y >= accuValMinY
									&& position.x <= accuValMaxX && position.y <= accuValMaxY)
					|| (accuVal.position.x >= valueMinX && accuVal.position.y >= valueMinY
									&& accuVal.position.x <= valueMaxX && accuVal.position.y <= valueMaxY)) {
					position.x = accuValMaxX + xIncrement;
				}
				return position;
			}, value.duplicate());
			accu.push({index: index, position: value, objectSize: getSize(index)});
			return accu;
		}, []);

		return objectPositions.map(objectPosition => objectPosition.position);
	}
}