export class RoomPositionFactory {
	
	static getRoomPositions(subjectivePositions, getSize, xIncrement = 1) {

		const factory = new RoomPositionFactory();
		const sizes = subjectivePositions.map((a, index) => {
			return getSize(index);
		})

		const objectPositions = subjectivePositions.reduce((accu, value, index) => {
			const positionSize = sizes[index];
			let isOver = undefined;
			do {
				isOver = factory.findObjectOver(value, positionSize, accu, sizes);
				if (isOver) {
					const roomSize = sizes[isOver.index];
					value.x += xIncrement;
				}
			} while (isOver)

			accu.push({index: index, position: value, objectSize: sizes[index]});
			return accu;
		}, []);

		// console.log("POSITIONS", objectPositions);

		return objectPositions.map(objectPosition => objectPosition.position);
	}

	findObjectOver(position, positionSize, currentRooms, sizes) {
		for (let i = 0; i < currentRooms.length; i ++) {
			const room = currentRooms[i];
			const roomSize = sizes[room.index];

			if (this.doesRoomOverlap(position, positionSize, room, roomSize)) {
				return room;
			}
		}
		return undefined;
	}


	/**
	 * Checks if all the points of a position and its size are inside of a 
	 * room.
	 * 
	 * 		*--------*
	 * 		|		 |
	 * 		|	*----|--* <- Point B
	 * 		|	|	 |	|
	 * 		|	|	 |	|
	 * 		*--------* 	|
	 * 			|		|
	 * 			*-------* <- Point D
	 */ 

	doesRoomOverlap(position, positionSize, room, roomSize) {
		const pointA = {x: position.x, y: position.y};
		const pointB = {x: position.x + positionSize.x, y: position.y};
		const pointC = {x: position.x, y: position.y + positionSize.y};
		const pointD = {x: position.x + positionSize.x, y: position.y + positionSize.y};

		return this.isPointInRoom(pointA, room, roomSize)
			|| this.isPointInRoom(pointB, room, roomSize)
			|| this.isPointInRoom(pointC, room, roomSize)
			|| this.isPointInRoom(pointD, room, roomSize);
	}

	/**
	 * Checks if the point is inside of the min and max positions of the
	 * rooms boundaries.
	 * 
	 * 		*--------*
	 * 		|		 |
	 * 		|	*	 |
	 * 		|		 |
	 * 		|		 |
	 * 		|		 |
	 * 		*--------* 
	 * 
	 */ 
	isPointInRoom(point, room, roomSize)  {
		const accuValMinX = room.position.x;
		const accuValMinY = room.position.y;
		const accuValMaxX = roomSize.x + room.position.x;
		const accuValMaxY = roomSize.y + room.position.y;

		return point.x >= accuValMinX 
			&& point.x <= accuValMaxX
			&& point.y >= accuValMinY
			&& point.y <= accuValMaxY;
	}
}

const factory = new RoomPositionFactory();
// room x 
console.assert(factory.isPointInRoom(
	{ x: 414, y: 777 + 15}, // point
	{ position: { x: 413, y: 787 } }, // room
	{ x: 4, y: 11 } //  roomSize
), "The point should be in the room");

console.assert(factory.doesRoomOverlap(
	{ x: 414, y: 777 }, // position
	{ x: 4, y: 15 }, // positionSize
	{ position: { x: 413, y: 787 } }, // room
	{ x: 4, y: 11 } //  roomSize
), "The position and position size should create a point that is located in the room");
