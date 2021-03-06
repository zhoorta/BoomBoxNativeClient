import RNFetchBlob from 'rn-fetch-blob'


export default class Filebase {


	constructor(dbfile) {

		this.path = RNFetchBlob.fs.dirs.CacheDir + '/'
		this.dbfile = this.path + '/' + dbfile
		
	}


	async exists()
	{
		return RNFetchBlob.fs.exists(this.dbfile).then((exist) => { return exist })
	}

	async write(obj) {
		return RNFetchBlob.fs.writeFile(this.dbfile, JSON.stringify(obj, null, 2), 'utf8')
			.then(()=>{ return true })
	}

	async deleteFile(id) {
		return RNFetchBlob.fs.unlink(this.path + id + '.ogg')
			.then(()=>{ return true })
	}


	async read() {
		if(await this.exists()) 
			return await RNFetchBlob.fs.readFile(this.dbfile, 'utf8')
	        	.then((data)=>{ return JSON.parse(data) })
		else return JSON.parse('[]')
	}

}