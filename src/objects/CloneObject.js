import {GameObject} from "../GameObject.js";

export class CloneObject extends GameObject {
	constructor(params) {
		super(params);
	}

	clone(obj) {
		for (let i = 0; i < this.children.length; i ++) {
			this.children[i].destroy();
		}
		this.children = [];
		this.position = obj.position;
		this.reflect(obj);
	}

	reflect(obj) {
		for (let i = 0; i < obj.children.length; i ++) {
			this.addChild(obj.children[i]);
		}
	}
}