import fs from 'fs/promises';
export default async function (fastify, opts) {
	const path = 'apps/getup/records.json';
	fastify.post('/', async function (request, reply) {
		const item = request.body;
		const itemArr = await fs.readFile(path).then(JSON.parse).catch(() => []);
		itemArr.unshift(item);
		await fs.writeFile(path, JSON.stringify(itemArr, null, '	'));
		return JSON.stringify(item);
	})
}
