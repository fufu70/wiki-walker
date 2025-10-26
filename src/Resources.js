class Resources {
	constructor() {
		// Everything we plan to downlaod
		this.toLoad = {
			hero: "/sprites/hero-sheet.png",
			caveGround: "/sprites/cave-ground.png",
			shadow: "/sprites/shadow.png",
			exit: "/sprites/exit.png",
			stairs: "/sprites/stairs.png",
			rod: "/sprites/rod.png",
			ground: "/sprites/ground.png",
			// fontWhite: "/sprites/sprite-font-white-3.png",
			fontWhite: "/sprites/sprite-font-white.png",
			textBox: "/sprites/text-box.png",
			userInputBox: "/sprites/user-input-box.png",
			sky: "/sprites/sky.png",
			cave: "/sprites/cave.png",
			portraits: "/sprites/portraits-sheet.png",

			// modern interiors
			shopBackground: "/sprites/shop-background.png",
			shopFloor: "sprites/shop-assets/Room_Builder_free_16x16.png",
			shopObjects: "sprites/shop-assets/Interiors_free_16x16.png",
			vase: "sprites/shop-assets/Vase_16x16.png",
			picture: "sprites/shop-assets/Picture_16x16.png",
			television: "sprites/shop-assets/TV_16x16.png",
			bookshelf: "sprites/shop-assets/Bookshelf_16x16.png",
			drawer: "sprites/shop-assets/Drawer_16x16.png",

			// Exterior Assets
			outdoors: "/sprites/outdoors.png",
			greenBackground: "/sprites/green-background.png",
			sign: "sprites/shop-assets/Sign_16x32.png",

			//npcs
			knight: "/sprites/knight-sheet-1.png",
			adam: "sprites/npcs/Adam_16x16.png",
			alex: "sprites/npcs/Alex_16x16.png",
			amelia: "sprites/npcs/Amelia_16x16.png",
			bob: "sprites/npcs/Bob_16x16.png",
			wizard: "sprites/npcs/Wizard_16x16.png",

			// loading screen
			loadingScreen: 'sprites/tmp/stairs-3.png'
		}

		// a bucket to keep all of our images
		this.images = {};

		// Load each image
		Object.keys(this.toLoad).forEach(key => {
			const img = new Image();
			img.src = this.toLoad[key];
			this.images[key] = {
				image: img,
				isLoaded: false
			}
			img.onload = () => {
				this.images[key].isLoaded = true;
			}
		})
	}
}

export const resources = new Resources();