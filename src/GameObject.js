import {Vector2} from './Vector2.js';
import {events} from './Events.js';
import {GRID_SIZE} from './helpers/Grid.js'

export class GameObject {
	constructor({position, size, isSolid, alwaysRender}) {
		this.uuid = crypto.randomUUID();
		this.position = position ?? new Vector2(0, 0);
		this.children = [];
		this.parent = null;
		this.hasReadyBeenCalled = false;
		this.isSolid = isSolid ?? false;
		this.drawLayer = null;
		this.size = size ?? new Vector2(GRID_SIZE, GRID_SIZE);
		this.alwaysRender = alwaysRender ?? false;
		// this.updateRenderPosition(undefined);

		// events.on("HERO_POSITION", this, heroPosition => {
		// 	this.updateRenderPosition(heroPosition);
		// });
	}

	stepEntry(delta, root) {
		this.children.forEach((child) => {
			child.stepEntry(delta, root);
		});

		// call ready on the first frame
		if (!this.hasReadyBeenCalled) {
			this.hasReadyBeenCalled = true;
			this.ready();
		}

		this.step(delta, root);
	}

	// Called when the Game Object is ready
	ready() {
		// leave empty
	}

	step(_delta) {
		// leave empty
	}

	draw(ctx, x, y) {
		const drawPosX = x + this.position.x;
		const drawPosY = y + this.position.y;

		this.drawImage(ctx, drawPosX, drawPosY);

		this.getDrawChildrenOrdered().forEach((child )=> {
			try {
				child.draw(ctx, drawPosX, drawPosY);
			} catch (e) {
				console.error(e);
			}
		})
	}

	getDrawChildrenOrdered() {
		const floors = this.children.filter(a => a.drawLayer === 'FLOOR');
		const exits = this.children.filter(a => a.drawLayer === 'EXIT');
		const nonFloors = this.children.filter(a => 
			a.drawLayer !== 'FLOOR' 
			&& a.drawLayer !== 'EXIT' 
		);

		return [
			...this.orderByVertical(floors),
			...this.orderByVertical(exits),
			...this.orderByVertical(nonFloors),
		]
	}

	orderByVertical(kids) {
		if (kids.length == 0) {
			return [];
		}
		// if (this.loading) {
		// 	// console.log([...kids].sort((a, b) => {
		// 	// 	return a.position.y > b.position.y ? 1 : -1
		// 	// }).map((a) => {
		// 	// 	return a.resource.image.src
		// 	// }));		
		// 	console.log([...kids].sort((a, b) => {
		// 		if (a.position.y == b.position.y) {
		// 			return 0;
		// 		}
		// 		return a.position.y > b.position.y ? 1 : -1
		// 	}).map((a) => {
		// 		return a.resource.image.src + a.position.y
		// 	}));
		// }
		return [...kids].sort((a, b) => {
			if (a.position.y == b.position.y) {
				return 0;
			}
			return a.position.y > b.position.y ? 1 : -1
		});
	}

	sort(arr) {

	}

	drawImage(ctx, drawPosX, drawPosY) {
		// leave empty
	}

	// remove from the tree
	destroy() {
		this.children.forEach(child => {
			child.destroy();
		});

		this.parent.removeChild(this);
	}

	addChild(gameObject) {
		gameObject.parent = this;

		this.children.push(gameObject);
	}

	hasChild(gameObject) {
		return this.children.findIndex((elem) => elem === gameObject) > -1;
	}

	removeChild(gameObject) {
		events.unsubscribe(gameObject);
		this.children = this.children.filter(g => {
			return gameObject !== g;
		})
	}

	hasPosition(vector2) {
		for (var x = 0; x < this.size.x; x += GRID_SIZE) {
			for (var y = 0; y < this.size.y; y += GRID_SIZE) {
				if (vector2.matches(new Vector2(this.position.x + x, this.position.y + y))) {
					return true;
				}
			}
		}
		return false;
	}

	updateRenderPosition(position) {
		this.renderPosition = position;
	}

	inRenderView(x, y) {
		let pos = window.renderPosition;
		if (pos === undefined 
			|| this.alwaysRender
			|| this.drawLayer === 'HERO'
			|| this.drawLayer === 'HUD'
			|| this.drawLayer === 'LEVEL'
		) {
			return true;
		}
		// if (this.drawLayer !== 'ROD') {
		// 	return true;
		// }

		const personHalf = 8;
		const canvasWidth = 320 + 64;
		const canvasHeight = 180 + 64;
		const halfWidth = -personHalf + canvasWidth / 2;
		const halfHeight = -personHalf + canvasHeight / 2;
		// console.log(pos, halfWidth, x, this);
		return x - halfWidth < pos.x
			&& x + halfWidth > pos.x
			&& y - halfHeight < pos.y
			&& y + halfHeight > pos.y;
	}
}