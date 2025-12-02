export class RoomPositionFactory {
	
	static getRoomPositions(subjectivePositions, getSize, xIncrement = 1) {

		const factory = new RoomPositionFactory();

		const objectPositions = subjectivePositions.reduce((accu, value, index) => {
			const positionSize = getSize(index);
			let isOver = undefined;
			do {
				isOver = factory.findObjectOver(value, positionSize, accu, getSize);
				if (isOver) {
					const roomSize = getSize(isOver.index);
					value.x = roomSize.x + isOver.position.x + xIncrement;
				}
			} while (isOver)

			accu.push({index: index, position: value, objectSize: getSize(index)});
			return accu;
		}, []);

		console.log("POSITIONS", objectPositions);

		return objectPositions.map(objectPosition => objectPosition.position);
	}

	findObjectOver(position, positionSize, currentRooms, getSize) {
		for (let i = 0; i < currentRooms.length; i ++) {
			const room = currentRooms[i];
			const roomSize = getSize(room.index);

			const accuValMinX = room.position.x;
			const accuValMinY = room.position.y;
			const accuValMaxX = roomSize.x + room.position.x;
			const accuValMaxY = roomSize.y + room.position.y;


			const valueMinX = position.x;
			const valueMinY = position.y;
			const valueMaxX = positionSize.x + position.x;
			const valueMaxY = positionSize.y + position.y;

			if ((position.x >= accuValMinX && position.y >= accuValMinY
								&& position.x <= accuValMaxX && position.y <= accuValMaxY)
				|| (room.position.x >= valueMinX && room.position.y >= valueMinY
								&& room.position.x <= valueMaxX && room.position.y <= valueMaxY)) {
				return room;
			}
		}
		return undefined;
	}
}