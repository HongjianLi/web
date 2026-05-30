import fs from 'fs/promises';
export default async function (fastify, opts) {
	fastify.post('/', async function (request, reply) {
		const record = request.body;
		await fs.appendFile(`apps/getup/${record.who}/records.txt`, `${record.date}\n`);
		return JSON.stringify(record);
	})
}
