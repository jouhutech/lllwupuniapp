<template>
	<view class="search">
		<view class="search-top">
			<image class="search-search" src="/static/images/search-search.png"></image>
			<input placeholder="搜索楼栋房屋" @input="inputChange" v-model="keyword" />
			<image class="search-close" src="/static/images/search-close.png"></image>
			<text>搜索</text>
		</view>
		<view class="search-result" v-show="isShowKeywordList">
			<view class="search-result-list" v-for="(row , keyword) in keywordList" :key="row.keyword" v-bind:id="keyword"
			 @click="addRoomKeywords">
				<rich-text :nodes="row.htmlStr"></rich-text>
				<rich-text></rich-text>
			</view>
		</view>
		<view class="search-content">
			<view class="search-content-left">
				<view v-for="(building, building_key) in building_list" :key="building_key" class="search-floor" :class="{active: curItem === building.building_id}"
				 @click="tab" v-bind:id="building.building_id">{{building.building_name}}</view>

			</view>
			<view class="search-content-center"></view>
			<view class="search-content-right">
				<view>
					<view v-for="(room,room_key) in room_list" :key="room_key" class="search-floor" :class="{active: curItem === room.room_id}" @click="addRoom"
					 v-bind:id="room_key">{{room.full_room_name}}</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '../../common/config.js';
	var serviceUrl = config.serviceUrl
	var _self
	var member_id = uni.getStorageSync('user_id') // 用户id

	export default {
		data() {
			return {
				curItem: 0,
				keyword: "",
				keywordList: [],
				isShowKeywordList: false,
				building_list: [],
				room_list: [],
				building_id: [],
			}
		},
		onLoad() {
			_self = this
			this.getBuildingList() // 获取楼栋列表
		},
		methods: {
			tab: function(e) {
				_self.curItem = e.target.id;
				_self.getRoomList(_self.curItem)
			},
			//监听输入
			inputChange(event) {
				var member_id = uni.getStorageSync('user_id') // 用户id
				//兼容引入组件时传入参数情况
				var keyword = event.detail ? event.detail.value : event;
				if (!keyword) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					return;
				}
				this.isShowKeywordList = true;
				//以下示例截取淘宝的关键字，请替换成你的接口
				uni.request({
					url: serviceUrl + 'personal_center/getRoomList',
					data: {
						member_id: member_id,
						keywords: keyword,
					},
					success: (res) => {
						var new_room_list = []
						var room_list = _self.keywords_room_list = res.data.data.room_list

						for (let index in room_list) {
							new_room_list[index] = room_list[index]['full_room_name']
						};
						this.keywordList = this.drawCorrelativeKeyword(new_room_list, keyword);
					}
				});
			},
			//高亮关键字
			drawCorrelativeKeyword(kstr, keyword) {
				var len = kstr.length,
					keywordArr = [];
				for (var i = 0; i < len; i++) {
					var row = kstr[i];
					if(row){
						//定义高亮
						var html = row.replace(keyword, "<span style='color: #4487f7;'>" + keyword + "</span>");
						var tmpObj = {
							keyword: row,
							htmlStr: html
						};
					}
					keywordArr.push(tmpObj)
				}
				return keywordArr;
			},

			// 获取楼栋列表
			getBuildingList: function(e) {
				var member_id = uni.getStorageSync('user_id') // 用户id
				uni.request({
					url: serviceUrl + 'personal_center/getBuildingList',
					data: {
						member_id: member_id,
					},
					method: "GET",
					header: {
						'content-type': 'application/json'
					},
					success: function(res) {
						// console.log(res);
						if (res.data.status == 1) {
							_self.building_list = res.data.data.building_list
							_self.getRoomList(_self.building_list[0].building_id)
						}
					}
				});
			},

			// 获取住户列表
			getRoomList: function(building_id) {
				var member_id = uni.getStorageSync('user_id') // 用户id
				uni.request({
					url: serviceUrl + 'personal_center/getRoomList',
					data: {
						member_id: member_id,
						building_id: building_id,
					},
					method: "GET",
					header: {
						'content-type': 'application/json'
					},
					success: function(res) {
						// console.log(res);
						if (res.data.status == 1) {
							_self.room_list = res.data.data.room_list
						}
					}
				});
			},

			addRoomKeywords: function(e) {
				var room_data = _self.keywords_room_list[e.currentTarget.id]

				uni.showModal({
					title: '提示',
					content: '确定新增房产：' + room_data['full_room_name'] + '吗？',
					success: function(res) {
						if (res.confirm) {
							// 用户点击确定
							_self.addUserRoom(room_data)
						} else if (res.cancel) {
							// 用户点击取消
						}
					}
				});
			},

			addRoom: function(e) {
				var room_data = _self.room_list[e.target.id]
				uni.showModal({
					title: '提示',
					content: '确定新增房产：' + room_data['full_room_name'] + '吗？',
					success: function(res) {
						if (res.confirm) {
							_self.addUserRoom(room_data)
						} else if (res.cancel) {}
					}
				});
			},

			// 绑定新房产 
			addUserRoom: function(room_data) {
				console.log(member_id);
				var building_id = room_data['building_id']
				var unit_id = room_data['unit_id']
				var room_id = room_data['room_id']
				var room_type_id = room_data['room_type_id']
				var full_room_name = room_data['full_room_name']
				var member_id = uni.getStorageSync('user_id') // 用户id
				uni.request({
					url: serviceUrl + 'personal_center/add_user_room',
					data: {
						member_id: member_id,
						building_id: building_id,
						unit_id: unit_id,
						room_id: room_id,
						room_type_id: room_type_id,
						full_room_name: full_room_name,
					},
					method: "POST",
					header: {
						'content-type': 'application/json'
					},
					success: function(res) {
						if (res.data.status == 1) {
							uni.showToast({
								title: '绑定完成',
								duration: 2000,
								complete : function(){
									uni.reLaunch({
										url: '/pages/index/index'
									});
								}
							});
						}
					}
				});
			},

		}
	}
</script>

<style>
	@import url("../../static/css/search.css");
</style>
