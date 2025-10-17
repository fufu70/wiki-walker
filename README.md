# 16bit-walker

To start the project run the following in the terminal:

```bash
npm install
npm run dev
```

## Using WTFWIKIPEDIA

https://www.npmjs.com/package/wtf_wikipedia/v/7.7.1

```
wtf.fetch('opencast mining', 'en', function(err, doc) {
	console.log(doc.sections().map(sec => sec.text()))
})
```

links are
` {text: string, type: string ("internal"), page: string} `
to view a link we just make a request with our `wtf.fetch(link.page, 'en', function(err, doc) {...})`. Sometimes the `text` field wont be populated.


Sections are a room. Each section can have links, paragraphs e.g.
```javascript
// Section
const section = doc.sections()[0];
// Each paragraph should just be a bookshelf inside of the room.
const paragraphs = section.paragraphs();
// to get the content of a link
// Each sections links can all be placed in a single stair case of a disambiguation room, which is just a room
// of all the links and a sign that states where the links go towards.
const links = section.links();
```

### Images

Images are also retriavable from an article. The best way to view them is to disperse them throughout the whole 
level randomly, as long as there is a place along the wall. Each image has a json with the following structure:

```
{
	"file": "File:Twincreeksblast.jpg",
	"thumb": "https://...",
	"url": "https://...",
	"caption": "Rock blasting at the large open-pit ...",
	"links": [...],
	"alt": "Machine is miniscule compared to the mine"
}
```

Below is how we would get that information collected.

```javascript
const image = doc.images()[0];
const imageContent = image.json();
```

It might be preferrable to just have a image popup, but I'd like to keep the vibe of the content and the image in the game.

```
-----------------------------------
|								  |
|								  |
|		    IMAGE HERE  		  |
|								  |
|								  |
-----------------------------------
|								  |
|      CAPTION and ALT HERE		  |
|								  |
-----------------------------------
```

The reality is that images can be pngs, jpegs, or even videos like ogv's or mp4's.

The best method is to just attach the images to the room like so:

```
images = doc.images().map(image => {
	return {
		url: image.url(),
		caption: image.caption(),
		<!-- links: getLinks() -->
	}
})
```