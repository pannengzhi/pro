$(document).ready(function() {
	init();

});;
(function(window, $) {
	window.init = _init;

	function _init() {
		_initEven();
		_initData();
	}
	var oneData = ['diecaifenju'];

	function _initEven() {
		//左上角分局的点击事件
		$("#areaName").bind("click", function() {
			$('#selectValue').toggle();
		});
		$(document).on("click", "#selectValue a", function() {
			var $this = $(this);
			var type = $this.data('type');
			var value = $this.text();
			$("#areaName").text(value);
			$("#alarmArea").text(value);
			$('#selectValue').hide();
			if(oneData.indexOf(type) == -1) {
				oneData.push(type);
				var script = document.createElement('script'),
					head = document.getElementsByTagName('head')[0];
				script.type = 'text/javascript';
				script.charset = 'UTF-8';
				script.src = "../data/" + type + ".js";
				if(script.addEventListener) {
					script.addEventListener('load', function() {

						_switchData(eval(type));

					}, false);
				}
				head.appendChild(script);
			}

		});

		// 侧边栏点击事件
		$("#sidebarBtn").bind("click", function() {
			var $sidebar = $("#warnSidebar");
			var right = $sidebar.css('right');
			$(this).toggleClass('closeIcon').toggleClass('openIcon');
			if(right == '0px') {
				$sidebar.animate({
					"right": "-183px"
				}, "slow");
			} else {
				$sidebar.animate({
					"right": "0"
				}, "slow");
			}
		});
	}

	function _initData() {
		showArea();
		_switchData(diecaifenju);

	}

	function _switchData(data) {
		_workNoticeFill(data.workNoticeData); // 工作提醒
		_wifiNetData(data.wifiData); // wifi数据
		_entranceGuardData(data.doorStopData); // 社区门禁
		_initbuildChart(data.factBuidData); // 实有建筑
		_initUnitChart(data.trueUnitData); //实有单位
		_initPeopleChart(data.trueDopulouData); // 实有人口
		_initKeyPersonChart(data.keyPersonData); //重点人员
		_warnData(data.alarmDate); // 110警情
		_alarmData(data.warnData); // 110报警
	}
	// 工作提醒 水球图
	function _workNoticeFill(jsonData) {
		// 上边水球
		var upChart = echarts.init(document.getElementById('workNoticeUp'));
		//自适应
		window.onresize = upChart.resize;
		var upOption = {
			series: [{
				name: '已完成',
				type: 'liquidFill',
				radius: '70px',
				data: [{
						value: jsonData.leftData[0].value,
						itemStyle: {
							normal: {
								color: '#239b5e'
							}
						}
					},
					{
						value: 0.35,
						itemStyle: {
							normal: {
								color: '#43fc86'
							}
						}
					}
				],
				label: {
					normal: {
						textStyle: {
							color: '#2D4B90', //字体进去颜色
							insideColor: '#ffffff', //水进去颜色
							fontSize: 25
						}
					}
				},
				outline: {
					borderDistance: 2, //边界与内圈之间的距离
					itemStyle: {
						borderWidth: 3, //边框宽度
						borderColor: '#0be8c7' //边框颜色
					}
				},
				backgroundStyle: {
					color: '#001748'
				}
			}]
		};

		upChart.setOption(upOption);
		// 下边水球
		var myChart = echarts.init(document.getElementById('workNoticeDown'));
		//自适应
		window.onresize = myChart.resize;
		var option = {
			tooltip: {
				trigger: 'item'
			},
			series: [{
				name: '已完成',
				type: 'liquidFill',
				radius: '70px',
				data: [{
					value: jsonData.leftData[1].value,
					itemStyle: {
						normal: {
							color: '#deb404'
						}
					}
				}],
				label: {
					normal: {
						textStyle: {
							color: '#2D4B90',
							insideColor: '#FFFFFF',
							fontSize: 25
						}
					}
				},
				outline: {
					borderDistance: 2, //边界与内圈之间的距离
					itemStyle: {
						borderWidth: 3, //边框宽度
						borderColor: '#deb404' //边框颜色
					}
				},
				backgroundStyle: {
					color: '#001748'
				}
			}]
		};
		myChart.setOption(option);
		// 柱形图
		var barChart = echarts.init(document.getElementById('workNoticeBarChart'));
		//自适应
		window.onresize = barChart.resize;
		var nameData = [],
			countData = [],
			totalData = [], //柱子数据
			unfinishData = [];
		jsonData.rightData.map(function(a, b) {
			nameData.push(a.name);
			countData.push(a.value);
			totalData.push(a.total);
			unfinishData.push(a.total - a.value);
		});
		var maxData = Math.max.apply(null, totalData) + Math.min.apply(null, totalData);

		var barOption = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'line',
					lineStyle: {
						opacity: 0
					}
				}
			},
			grid: {
				left: '10px',
				top: '25px',
				bottom: '1px',
				width: '170px',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				axisTick: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#0c3b71',
					}
				},
				axisLabel: {
					show: true,
					color: '#ffffff',
					fontSize: 11,
					interval: 0,
					formatter: function(val) {

						var strs = val.split(''); //字符串数组  
						var str = ''
						for(var i = 0, s; s = strs[i++];) { //遍历字符串数组  
							str += s;
							if(i == 2) str += '\n';
						}
						return str
					}
				},
				data: nameData
			}, {
				type: 'category',
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				splitArea: {
					show: false
				},
				splitLine: {
					show: false
				},
				data: []
			}, ],
			yAxis: [{
				type: 'value',
				gridIndex: 0,
				min: 0,
				max: maxData,
				splitNumber: 10,
				splitLine: {
					show: false
				},
				axisLine: {
					show: false
				},
				axisTick: {
					"show": false
				},
				axisLabel: {
					show: false
				},
				splitArea: {
					show: true,
					areaStyle: {
						color: ['rgba(250,250,250,0.0)', 'rgba(250,250,250,0.05)']
					}
				}
			}],
			series: [{
					type: 'bar',
					xAxisIndex: 1,
					itemStyle: {
						normal: {
							show: true,
							color: 'transparent'
						}
					},
					label: {
						normal: {
							show: true,
							formatter: function(params) {
								var stuNum = 0;
								totalData.forEach(function(value, index, array) {
									if(params.dataIndex == index) {
										stuNum = value;
									}
								})
								return stuNum;
							},
							position: 'top',
							textStyle: {
								color: 'white',
								fontSize: 12,
							}
						}
					},
					barWidth: '25%',
					data: [maxData, maxData, maxData, maxData]
				},
				{
					name: '已完成',
					type: 'bar',
					barWidth: '8px',
					stack: '总量',
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(
								0, 0, 0, 1, [{
										offset: 0,
										color: '#00eaee'
									},
									{
										offset: 1,
										color: '#018aff'
									}
								]
							)
						}
					},
					data: countData
				},
				{
					name: '未完成',
					type: 'bar',
					barWidth: '8px',
					stack: '总量',
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(
								0, 0, 0, 1, [{
										offset: 0,
										color: '#fb9af6'
									},
									{
										offset: 1,
										color: '#981afa'
									}

								]
							)
						}
					},
					data: unfinishData

				}
			]
		};

		barChart.setOption(barOption);

	}
	// 天网WIFI数据
	function _wifiNetData(data) {

		var isChange = (data[0].change).indexOf('-') != -1 ? 'downIcon' : 'upIcon';
		$('#wifiNetCount1').text(data[0].total);
		$('#onlineData1').text(data[0].onlineCount);
		$('#changeData1').text(data[0].change).next().removeClass().addClass(isChange);
		var w = data[0].onlineCount * 100 / (data[0].total).toFixed(2) + '%';
		$('#progressBar1').css('width', w);

		isChange = (data[1].change).indexOf('-') != -1 ? 'downIcon' : 'upIcon';
		$('#wifiNetCount2').text(data[1].total);
		$('#onlineData2').text(data[1].onlineCount);
		$('#changeData2').text(data[1].change).next().removeClass().addClass(isChange);
		w = data[1].onlineCount * 100 / (data[1].total).toFixed(2) + '%';
		$('#progressBar2').css('width', w);

		isChange = (data[2].change).indexOf('-') != -1 ? 'downIcon' : 'upIcon';
		$('#wifiNetCount3').text(data[2].total);
		$('#onlineData3').text(data[2].onlineCount);
		$('#changeData3').text(data[2].change).next().removeClass().addClass(isChange);
		w = data[2].onlineCount * 100 / (data[2].total).toFixed(2) + '%';
		$('#progressBar3').css('width', w);
		/*post_async({}, '../wifiServer/dailySummary.do',
			_callback_getWifiData);*/

		function _callback_getWifiData(data) {
			$('#collectData').text(data.result);
		}
	}
	// 显示门禁数据
	function _entranceGuardData(data) {
		var isChange = (data[0].change).indexOf('-') != -1 ? 'downIcon' : 'upIcon';
		$('#apartmentCount').text(data[0].value);
		$('#apartmentChange').text(data[0].change).next().removeClass().addClass(isChange);

		isChange = (data[1].change).indexOf('-') != -1 ? 'downIcon' : 'upIcon';
		$('#roomCount').text(data[1].value);
		$('#roomChange').text(data[1].change).next().removeClass().addClass(isChange);

		isChange = (data[2].change).indexOf('-') != -1 ? 'downIcon' : 'upIcon';
		$('#monitorCount').text(data[2].value);
		$('#monitorChange').text(data[2].change).next().removeClass().addClass(isChange);

		isChange = (data[3].change).indexOf('-') != -1 ? 'downIcon' : 'upIcon';
		$('#populousCount').text(data[3].value);
		$('#populousChange').text(data[3].change).next().removeClass().addClass(isChange);

	}

	// 实有建筑显示
	function _initbuildChart(jsonData) {
		var total = PrefixInteger(jsonData.total);
		for(var i = 0; i < total.length; i++) {
			$('#buildData .numbar').eq(i).text(total.charAt(i));
		}
		var nameData = [];
		for(var i = 0; i < jsonData.ringData.length; i++) {
			nameData.push(jsonData.ringData[i].name);
		}
		var pieChart = echarts.init(document.getElementById('buildAnnularChart'));
		var pieOption = {
			tooltip: {
				trigger: 'item',
				formatter: function(params) {
						return params.name+" : "+params.value + '%';
					}
			},
			legend: {
				orient: 'vertical',
				icon: 'circle',
				bottom: -5,
				itemWidth: 10, // 图例图形宽度
				itemHeight: 10,
				itemGap: 10,
				x: 'center',
				textStyle: {
					color: '#fff',
					fontSize: 12
				},
				data: nameData
			},
			series: [{
				type: 'pie',
				radius: ['45%', '60%'],
				center: ['50%', '35%'],
				color: ['#1bb4b7', '#f3b383'],
				data: jsonData.ringData,
				label: {
					normal: {
						show: false
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				}

			}]
		};
		pieChart.setOption(pieOption);

		// 实有建筑柱形图显示
		var myChart = echarts.init(document.getElementById('buildBarChart'));

		var nameData = [],
			countData = [], //柱子数据
			changeData = [];
		jsonData.barData.map(function(a, b) {
			nameData.push(a.name);
			countData.push(a.value);
			changeData.push(a.change);
		});
		var maxData = Math.max.apply(null, countData) + Math.min.apply(null, countData) * 2;
		var maxNum = Math.max.apply(null, countData) + Math.min.apply(null, countData);
		var option = {
			grid: {
				x: '8px',
				y: '15px',
				width: '205px',
				height: 'calc(100% - 8px)',
				y2: '0px',
				containLabel: true
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'line',
					lineStyle: {
						opacity: 0
					}
				}
			},
			xAxis: [{
				type: 'category',
				axisTick: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#0c3b71',
					}
				},
				axisLabel: {
					color: '#00affe',
					fontSize: 11,
					interval: 0
				},
				data: nameData
			}, {
				type: 'category',
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				splitArea: {
					show: false
				},
				splitLine: {
					show: false
				},
				data: []
			}, ],
			yAxis: [{
					type: 'value',
					gridIndex: 0,
					axisTick: {
						"show": false
					},
					min: 0,
					max: maxData,
					axisLine: {
						show: false
					},
					splitLine: {　　　　
						show: false　　
					},
					axisLabel: {
						show: false
					},
					splitArea: {
						show: false
					}
				},
				{
					type: 'value',
					gridIndex: 0,
					min: 0,
					max: maxData,
					splitNumber: 10,
					splitLine: {
						show: false
					},
					axisLine: {
						show: false
					},
					axisTick: {
						"show": false
					},
					axisLabel: {
						show: false
					},
					splitArea: {
						show: true,
						areaStyle: {
							color: ['rgba(250,250,250,0.0)', 'rgba(250,250,250,0.05)']
						}
					}
				}
			],
			series: [{
					type: 'bar',
					xAxisIndex: 1,
					itemStyle: {
						normal: {
							show: true,
							color: 'transparent'
						}
					},
					label: {
						normal: {
							show: true,
							formatter: function(params) {
								var stuNum = 0;
								countData.forEach(function(value, index, array) {
									if(params.dataIndex == index) {
										stuNum = value;
									}
								})
								return stuNum;
							},
							position: 'top',
							textStyle: {
								color: 'white',
								fontSize: 12,
							}
						}
					},
					barWidth: '25%',
					data: [maxNum, maxNum, maxNum, maxNum]
				},
				{
					type: 'bar',
					itemStyle: {
						normal: {
							show: true,
							color: new echarts.graphic.LinearGradient(
								0, 0, 0, 1, [{
										offset: 0,
										color: '#14c6b4'
									},
									{
										offset: 1,
										color: '#f5af00'
									}
								]),
							barBorderRadius: 50,
							borderWidth: 0,
							borderColor: '#333',
						}
					},
					label: {
						normal: {
							show: false,

						}
					},
					barWidth: '15%',
					data: countData
				}
			]
		};
		//自适应
		window.onresize = myChart.resize;
		myChart.setOption(option);
		var isChange = '';
		for(var i = 0; i < changeData.length; i++) {
			isChange = (changeData[i]).indexOf('-') != -1 ? 'downIcon' : 'upIcon';
			$('#buildCount font').eq(i).text(changeData[i]).next().removeClass().addClass(isChange);
		}
	}

	// 实有单位
	function _initUnitChart(jsonData) {
		var total = PrefixInteger(jsonData.total);
		for(var i = 0; i < total.length; i++) {
			$('#unitTotalData .numbar').eq(i).text(total.charAt(i));
		}
		var nameData = [],
			countData = [], //柱子数据
			changeData = [];
		jsonData.barData.map(function(a, b) {
			nameData.push(a.name);
			countData.push(a.value);
			changeData.push(a.change);
		});
		var maxData = Math.max.apply(null, countData) + Math.min.apply(null, countData) * 2;
		/*for(var i = 0; i < countData.length; i++) {
			maxData += countData[i];
		}*/
		var myChart = echarts.init(document.getElementById('unitChart'));
		//自适应
		window.onresize = myChart.resize;

		var label = {
			normal: {
				show: false
			}
		};

		var series = [];

		series.push({
			name: '柱',
			type: 'bar',
			stack: 2,
			xAxisIndex: 0,
			data: countData,
			label: label,
			barWidth: 4,
			barGap: 5,
			tooltip: {
				show: true
			},
			itemStyle: {
				normal: {
					color: '#f298f2',
				}
			},
			z: 2
		}, {
			name: '球',
			type: 'scatter',
			stack: 2,
			symbolOffset: [0, 0], //相对于原本位置的偏移量
			data: [0, 0, 0, 0],
			label: {
				normal: {
					show: false,
				}
			},
			tooltip: {
				show: false
			},
			xAxisIndex: 2,
			symbolSize: 9,
			itemStyle: {
				normal: {
					color: '#f298f2',
					borderWidth: 6,
					borderColor: 'rgba(244,197,241,0.8)',
					shadowColor: 'rgba(0, 0, 0, 0.5)',
					emphasis: {
						areaColor: '#f298f2'
					}
				}
			},
			z: 2
		}, {
			name: '背景',
			type: 'bar',
			xAxisIndex: 1,
			itemStyle: {
				normal: {
					color: 'rgba(8,36,84,.8)'
				}
			},
			tooltip: {
				show: false
			},
			label: {
				normal: {
					show: true,
					formatter: function(params) {
						var stuNum = 0;
						countData.forEach(function(value, index, array) {
							if(params.dataIndex == index) {
								stuNum = value;
							}
						});
						return stuNum;
					},
					position: 'top',
					textStyle: {
						color: '#fff',
						fontSize: 12,
					}
				}
			},
			barWidth: '20px',
			data: [maxData, maxData, maxData, maxData],
			z: 1
		})

		var option = {
			grid: {
				left: '8%',
				top: '18px',
				bottom: '0px',
				height: '85%',
				containLabel: true
			},
			tooltip: {
				show: "true",
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
					shadowStyle: {
						color: 'rgba(112,112,112,0)',
					},
				}
			},
			xAxis: [{
				type: 'category',
				axisTick: {
					show: false
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#0c3b71',
					}
				},
				axisLabel: {
					inside: false,
					textStyle: {
						color: '#00affe',
						fontSize: '11',
					},
				},
				data: nameData
			}, {
				type: 'category',
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				splitArea: {
					show: false
				},
				splitLine: {
					show: false
				},
				data: nameData
			}, {
				type: 'category',
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				splitArea: {
					show: false
				},
				splitLine: {
					show: false
				},
				data: nameData
			}],
			yAxis: {
				type: 'value',
				axisTick: {
					show: false
				},
				axisLine: {
					show: false
				},
				splitLine: {
					show: false
				},
				axisLabel: {
					show: false
				},
			},
			series: series

		};

		myChart.setOption(option);

		var isChange = '';
		for(var i = 0; i < changeData.length; i++) {
			isChange = (changeData[i]).indexOf('-') != -1 ? 'downIcon' : 'upIcon';
			$('#unitbottomNum font').eq(i).text(changeData[i]).next().removeClass().addClass(isChange);
		}
	}
	// 实有人口图表显示
	function _initPeopleChart(jsonData) {

		var total = PrefixInteger(jsonData.total);
		for(var i = 0; i < total.length; i++) {
			$('#actualPopulationData .numbar').eq(i).text(total.charAt(i));
		}
		var nameData = [],
			countData = [],
			changeData = [];
		jsonData.barData.map(function(a, b) {
			nameData.push(a.name);
			countData.push(a.value);
			changeData.push(a.change);
		});
		var minData = Math.min.apply(null, countData) + Math.max.apply(null, countData);
		var myChart = echarts.init(document.getElementById('truePeople'));
		//自适应
		//window.onresize = myChart.resize;
		var dataStyle = {
			normal: {
				label: {
					show: false
				},
				labelLine: {
					show: false
				},
				shadowBlur: 40,
				borderWidth: 10,
				shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
			}
		};
		var placeHolderStyle = {
			normal: {
				color: '#393d50',
				label: {
					show: false
				},
				labelLine: {
					show: false
				}
			},
			emphasis: {
				color: '#393d50'
			}
		};
		var option = {
			tooltip: {
				trigger: 'item',
				show: true,
				"formatter": "{b0}:{c0}人"
			},
			legend: {
				orient: 'vertical',
				icon: 'circle',
				itemWidth: 10, // 图例图形宽度
				itemHeight: 10,
				right: 'right',
				top: '5',
				itemGap: 15,
				data: nameData, // ['流动人口', '重点人口', '入境人口', '出境人口'],
				textStyle: {
					color: '#00affe',
					fontSize: 14
				},
				formatter: function(params) {
					var stuNum = '';
					for(var i = 0; i < 4; i++) {
						if(params == nameData[i]) {
							stuNum = params + " : " + countData[i];
							return stuNum;
						}
					}

				}
			},
			series: [{
					type: 'pie',
					clockWise: false,
					radius: [52, 55],
					center: ['35%', '45%'],
					itemStyle: dataStyle,
					hoverAnimation: false,
					startAngle: 90,
					data: [{
							value: countData[0],
							name: nameData[0], // '流动人口'
							itemStyle: {
								normal: {
									color: '#2ee8ff'
								}
							}
						},
						{
							value: jsonData.total / 40,
							tooltip: {
								show: false
							},
							itemStyle: placeHolderStyle
						},
					]
				},
				{
					type: 'pie',
					clockWise: false,
					radius: [43, 46],
					center: ['35%', '45%'],
					itemStyle: dataStyle,
					hoverAnimation: false,
					startAngle: 90,
					data: [{
							value: countData[1],
							name: nameData[1], // '重点人口'
							itemStyle: {
								normal: {
									color: '#ac4aff'
								}
							}
						},
						{
							value: jsonData.total / 40,
							tooltip: {
								show: false
							},
							itemStyle: placeHolderStyle
						},
					]
				}, {
					type: 'pie',
					clockWise: false,
					radius: [34, 37],
					center: ['35%', '45%'],
					itemStyle: dataStyle,
					hoverAnimation: false,
					startAngle: 90,
					data: [{
							value: countData[2],
							name: nameData[2], // '入境人口'
							itemStyle: {
								normal: {
									color: '#ff3af2'
								}
							}
						},
						{
							value: jsonData.total / 40,
							tooltip: {
								show: false
							},
							itemStyle: placeHolderStyle
						},
					]
				},
				{
					type: 'pie',
					clockWise: false,
					radius: [25, 28],
					center: ['35%', '45%'],
					itemStyle: dataStyle,
					hoverAnimation: false,
					startAngle: 90,
					label: {
						borderRadius: '10',
					},
					data: [{
							value: countData[3],
							name: nameData[3], // '出境人口'
							itemStyle: {
								normal: {
									color: '#f7932a'
								}
							}
						},
						{
							value: jsonData.total / 40,
							tooltip: {
								show: false
							},
							itemStyle: placeHolderStyle
						},
					]
				}
			]
		};

		myChart.setOption(option);
		var isChange = '';
		for(var i = 0; i < changeData.length; i++) {
			isChange = (changeData[i]).indexOf('-') != -1 ? 'downIcon' : 'upIcon';
			$('#populationShow font').eq(i).text(changeData[i]).next().removeClass().addClass(isChange);
		}

	}
	// 重点人员图表
	function _initKeyPersonChart(jsonData) {
		var total = PrefixInteger(jsonData.total);
		for(var i = 0; i < total.length; i++) {
			$('#keyPersonData .numbar').eq(i).text(total.charAt(i));
		}
		var nameData = [],
			countData = [],
			changeData = [];
		jsonData.classData.map(function(a, b) {
			nameData.push(a.name);
			countData.push(a.value);
			changeData.push(a.change);
		});
		var myChart = echarts.init(document.getElementById('keyPersonChart'));
		//自适应
		window.onresize = myChart.resize;
		option = {
			"grid": {
				"left": "21%",
				"top": "10%",
				"right": 1,
				"bottom": 10
			},
			"tooltip": {
				"trigger": "item",
				"textStyle": {
					"fontSize": 12
				},
				"formatter": "{b0}:{c0}人"
			},
			"xAxis": {
				"max": jsonData.total,
				"splitLine": {
					"show": false
				},
				"axisLine": {
					"show": false
				},
				"axisLabel": {
					"show": false
				},
				"axisTick": {
					"show": false
				}
			},
			"yAxis": [{
					"type": "category",
					"inverse": false,
					"data": nameData,
					"axisLine": {
						"show": false
					},
					"axisTick": {
						"show": false
					},
					"axisLabel": {
						"margin": -15,
						"textStyle": {
							"color": "#00affe",
							"fontSize": 12
						}
					}
				},

			],
			"series": [{
					"type": "pictorialBar",
					"symbolRepeat": "fixed",
					"symbolMargin": "-3px",
					"symbolClip": true,
					"symbolSize": 20,
					"symbolPosition": "start",
					"symbolOffset": [
						20,
						0
					],
					"symbolBoundingData": jsonData.total,
					"data": [{
							value: countData[0],
							symbol: 'image://./img/pinkMan.png'
						},
						{
							value: countData[1],
							symbol: 'image://./img/blueMan.png'
						},
						{
							value: countData[2],
							symbol: 'image://./img/yellowMan.png'
						},
						{
							value: countData[3],
							symbol: 'image://./img/redMan.png'

						}
					],
					"z": 10
				},
				{
					"type": "pictorialBar",
					"itemStyle": {
						"normal": {
							"opacity": 0.3
						}
					},
					tooltip: {
						show: false
					},
					"label": {
						"normal": {
							"show": false
						}
					},
					"animationDuration": 0,
					"symbolRepeat": "fixed",
					"symbolMargin": "-3px",
					"symbol": "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAADYElEQVR4nO2dz0sUYRjHP7tIdAmxQ1LdlhCKMohAIsgiyEuHjkUEFQTlpejS/xCCBB06RBGBBKIG4cGyH0qHBKE9eKyFqBQPRQeNCt06vGNY7bq7szPfeZLnAwuzM+/zgw/DDvMu70wOIVveLscJOwycA44A24CfwAfgKXAbeFVvovlC/o/vuVwuTj+x0FWiYdGbgXvA8RrjHgAXgIVaCbMU3SKr1BhtwEtgZx1jTwI7gG7ga5pNNUO+9pBMuEN9klfYD9xMqZdEsCj6AHAiRtxZYFeyrSSHRdGnYsblCD8jJrEoek8TsbsT6yJhLIrelFFsqlgUPZtRbKpYFP2kidjxxLpIGIuiB4AvMeLmgJGEe0kMi6I/AVdjxPVSx91hVlgUDXAXuEaY16jFMnAJeJhqR01iVTTAdeAYUFxjzBRwCLgl6agJrM51rDAO7AP2EmbxthPO8vfAc2Ams84axLpoCGKLrH1mm8eC6KPAGaAL2Fpj7AZgY7T9DfhRY/wc4eflPmH+OjOynI8uEGbpukXlJ4Dz84V8aWWHcj46q4thFzCNTjJRren2UrlLWPM3WYjuAMYIk/tq2oCx9lK5Q11YLboFGARaxXVX0woMtpfK0uuTWvRFoFNcsxKdhF5kqEX3iuuthbQXtehG/gdMG2kvlm/B1xUuWoSLFmFF9CRwg2TnM4pRzskEc8bGiugR4ArhNjkpJqKcJv51sSJ63eOiRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEWvTHKvs/p1izWu5qvaSCWvTlCvtmgeEUaw5TeUVtpV5SQy16COgBRoHXhMWb3aS7PnAhqjEQ1RwFeuYL+aEUa/5DFmtYHkefOEwQVmcBvKD+FQNvgNN/P+pHiV8MRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEixbhokVYEx3nudGKXE1jTfS6xUWLcNEiXLQIFy3CRYtw0SJctAgXLcJFi3DRIv430eUq2+axJvp7jePPqmzHySXFmuhHwFKVYzNA/6rv/VR/s9BSlMsM1kTPEN4DPkU4I8vAO6APOAgsrhq7GO3ri8aUo5ipKIep1zv9AtipgOACGIrLAAAAAElFTkSuQmCC",
					"symbolSize": 20,
					"symbolBoundingData": jsonData.total,
					"symbolPosition": "start",
					"symbolOffset": [
						20,
						0
					],
					"data": [jsonData.total, jsonData.total, jsonData.total, jsonData.total],
					"z": 5
				}
			]
		};

		myChart.setOption(option);
		var isChange = '';
		for(var i = 0; i < changeData.length; i++) {
			isChange = (changeData[i]).indexOf('-') != -1 ? 'downIcon' : 'upIcon';
			$('#keyPersonChangeData font').eq(i).text(changeData[i]).next().removeClass().addClass(isChange);
		}
	}
	// 110警情
	function _warnData(data) {
		var $warnDom = $('#warnList');
		$warnDom.empty();
		var dataStr = '';
		for(var i = 0; i < data.length; i++) {
			dataStr += '<li><label>' + data[i].alarmType + '</label><label>' + data[i].alarmTime +
				'</label><label>' + data[i].alarmAddr + '</label><label>' + data[i].alarmMan + '</label></li>';
		}
		$warnDom.append(dataStr).niceScroll().resize();
	}
	// 110报警
	function _alarmData(data) {
		$("#alarmTotal").text(data.total);
		$("#criminalCount").text(data.criminalCount);
		$("#safeCount").text(data.safeCount);
		$("#trafficCount").text(data.trafficCount);
		$("#fireHelpCount").text(data.helpCount);
		$("#peopleHelpCount").text(data.helpCount);
		$("#reportCount").text(data.reportCount);
	}

	function PrefixInteger(num) {
		var num = num + '';
		if(num.length >= 6) return num;
		return PrefixInteger("0" + num, 6);
	}

	function showArea() {

		var $treeDom = $('#tree');
		$treeDom.empty();

		var dataStr = '<ul><li><div class="open_menu"><span></span><a data-type="' + areaData.key + '" title="' + areaData.value + '">' + areaData.value + '</a></div><ul>';
		for(var i = 0; i < areaData.children.length; i++) {
			dataStr += '<li><div class="open_menu"><span></span><a data-type="' + areaData.children[i].key + '" title="' + areaData.children[i].value + '">' + areaData.children[i].value + '</a></div>';
			var child = areaData.children[i];
			if(child.children.length > 0) {
				dataStr += '<ul>';
				for(var k = 0; k < child.children.length; k++) {
					dataStr += '<li><div class="close_menu"><span></span><a data-type="' + child.children[k].key + '" title="' + child.children[k].value + '">' + child.children[k].value + '</a></div></li>';
				}
				dataStr += '</ul>';
			}
			dataStr += '</li>';
		}
		dataStr += '</ul></li></ul>';
		$treeDom.append(dataStr).niceScroll().resize();
	}
})(window, jQuery);