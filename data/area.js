/*===区域划分===*/
var areaData = 
	/* 第一层 分局  开始*/
	{
		"key": "diecaifenju", // 输入"value"值名称的拼音
		"value": "叠彩分局", //名称
		/* 第二层 派出所 开始*/
		"children": [{
				"key": "diecaipaichusuo", // 输入"value"值名称的拼音
				"value": "叠彩派出所", //名称
				/* 第三层 社区 */
				"children": [{"key": "diecaishequ", "value": "叠彩社区"}] //在[]里添加社区，格式  {"key": "diecaishequ", "value": "叠彩社区"}
			}, {
				"key": "ludipaichusuo", // 输入"value"值名称的拼音
				"value": "芦笛派出所", //名称
				/* 第三层 社区 */
				"children": [] //在[]里添加社区，格式  {"key": "diecaishequ", "value": "叠彩社区"}
			},
			{
				"key": "beimenpaichusuo", // 输入"value"值名称的拼音
				"value": "北门派出所", //名称
				/* 第三层 社区 */
				"children": [] //在[]里添加社区，格式  {"key": "diecaishequ", "value": "叠彩社区"}
			},
			{
				"key": "dahepaichusuo", // 输入"value"值名称的拼音
				"value": "大河派出所", //名称
				/* 第三层 社区 */
				"children": []
			},
			{
				"key": "shuitashanpaichusuo", // 输入"value"值名称的拼音
				"value": "水塔山派出所", //名称
				/* 第三层 社区 */
				"children": []
			}
		]
		/* 第二层  开始*/
	}
	/* 第一层  结束*/