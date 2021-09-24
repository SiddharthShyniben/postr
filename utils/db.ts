import {Database} from '../deps.ts';

interface IDMapping {
	local: string;
	remote: string;
	platform: string;
}

const idMappingDB = new Database<IDMapping>('./.postr/id-db.json');

export async function addMapping(local: string, remote: string, platform: string) {
	await idMappingDB.insertOne({local, remote, platform});
}

export async function getMapping(local: string) {
	return await idMappingDB.findOne({local});
}
