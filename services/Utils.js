
export default class Utils {


	comparetag(a, b) {
		const aa = a.tag.toUpperCase();
		const bb = b.tag.toUpperCase();
		let comparison = 0;
		if (aa > bb) comparison = 1;
		else if (aa < bb) comparison = -1;
		return comparison;
		}


	comparetitle(a, b) {
		const aa = a.title.toUpperCase();
		const bb = b.title.toUpperCase();
		let comparison = 0;
		if (aa > bb) comparison = 1;
		else if (aa < bb) comparison = -1;
		return comparison;
		}


	returnContentByTag = (data) => {

		var curr_tag = null
		var curr_idx = -1

		var ret = []

console.log('returnContentByTag',data)
		data = data.sort(this.comparetag) 

		data.map((item) => {

			if(curr_tag!==item.tag) {
				ret.push({ tag: item.tag, content:[] })
				curr_idx = curr_idx + 1
				curr_tag = item.tag
			}
			ret[curr_idx].content.push(item)

		})

		ret = ret.map((item) => {  
			return {
				tag: item.tag,
				content: item.content.sort(this.comparetitle)
			}
		})

		return ret
	}

}