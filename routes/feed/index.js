import fs from 'fs/promises';
export default async function (fastify, opts) {
	const path = 'apps/feed/favorites.json';
	fastify.post('/', async function (request, reply) {
		const item = request.body;
		const itemArr = await fs.readFile(path).then(JSON.parse);
		itemArr.push(item);
		await fs.writeFile(path, JSON.stringify(itemArr, null, '	'));
		return `Item saved.\n${item.title}`;
	})
	fastify.delete('/', async function (request, reply) {
		const item = request.body;
		const itemArr = await fs.readFile(path).then(JSON.parse);
		const itemIndex = itemArr.findIndex(i => i.pubDate === item.pubDate && i.title === item.title);
		console.assert(itemIndex >= 0);
		itemArr.splice(itemIndex, 1);
		await fs.writeFile(path, JSON.stringify(itemArr, null, '	'));
		return `Item deleted.\n${item.title}`;
	})
}
