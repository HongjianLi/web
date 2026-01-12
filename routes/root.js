export default async function (fastify, opts) {
	const regexp = /\d+(\.\d{1,2})?元/g;
	fastify.get('/', async function (request, reply) {
//		return { root: true }
		const response = await fetch('http://rss.mydrivers.com/rss.aspx?Tid=1', {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
				'Accept-Language': 'en,en-US;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6',
			},
		})
		const lines = (await response.text()).split('\r\n')
		if (lines.length < 18) return null
		console.assert(lines[17] === '\t\t<item>')
		const items = []
		for (let itemLines = [], title, category, i = 17; i < lines.length - 2; ++i) {
			const line = lines[i]
			itemLines.push(line)
			if (line.startsWith('\t\t\t<title><![CDATA[')) {
				title = line.substring(19, line.length - 11);
			} else if (line.startsWith('\t\t\t<category><![CDATA[')) {
				category = line.substring(22, line.length - 14);
			} else if (line === '\t\t</item>') {
				let matches;
				if (![ '传统汽车', '电动汽车', '新能源汽车', '无人驾驶汽车', '汽车厂商', '摩托车', '车载配件', '服装鞋帽', '网友热议', '网络红人', '视点人物', '教育未来', '手机游戏', '电脑游戏', '主机游戏', '游戏主机', '电子竞技', '精彩影视', '电影动画', '生科医学', '生物世界', '奇趣探险', '个人洗护', '餐饮零食', '日常用品' ].includes(category) && (['小米', '会员'].some(whiteWord => title.includes(whiteWord)) || !(matches = title.match(regexp)) || matches.some(m => parseFloat(m.substring(0, m.length - 1)) >= 100))) { // Match price >= 100元. m[m.length - 1] is the currenty symbol 元.
					items.push(...itemLines)
				}
				itemLines.length = 0
			}
		}
		reply.type('text/xml')
		return [...lines.slice(0, 17), ...items, ...lines.slice(-2), ''].join('\n')
	})
}
/*
AAPS http://link.springer.com/search.rss?facet-journal-id=12248
Annual Reviews http://www.annualreviews.org/action/showFeed?ui=45mu4&mi=3fndc3&ai=so&jc=pharmtox&type=etoc&feed=rss
Drug Discovery Today - Downloads http://www.drugdiscoverytoday.com/rss/downloads/
Database: The Journal of Biological Databases and Curation http://database.oxfordjournals.org/rss/current.xml
Nature Reviews Drug Discovery - Issue - nature.com science feeds http://feeds.nature.com/nrd/rss/current
*/
