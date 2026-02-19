#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static';
const fastify = Fastify({ logger: true })
fastify.register(fastifyStatic, {
	root: path.join(path.dirname(fileURLToPath(import.meta.url)), 'apps'),
});
await fastify.listen({ port: 12080, host: '::' })
