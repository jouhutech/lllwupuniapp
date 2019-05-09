<template>
	<view class="switch">
		<view class="switch-top">
			<view class="switch-content current-active" style="padding:0 30rpx">
				<text>{{houseName}}</text>
				<text>当前</text>
			</view>
			<view v-for="(room, room_key) in userRoomlist" :key="room_key" class="switch-content switch-active" style="padding:0 30rpx">
				<text>{{room.room_type_name}}:{{room.full_room_name}}</text>
				<text @click="tab" v-bind:id="room.user_room_id">切换</text>
			</view>
		</view>
		
		<view class="switch-bottom" >
			<button type="default" @click="newBinding">
				<image src="/static/images/switch-binding.png"></image>
				<view>绑定新房屋</view>
			</button>
		</view>
	</view>
</template>

<script>
	import config from '../../common/config.js';  
	var serviceUrl = config.serviceUrl
	var _self
	var member_id  = uni.getStorageSync('user_id')	// 用户id

	export default {
		data() {
			return {
				userRoomlist :[],
				houseName:[]
			}
		},
		onLoad() {
			_self = this
			_self.getMemberRoom()	// 获取用户房间列表
		},
		methods: {
			tab:function(e){
				_self.curItem = e.target.id;
				_self.setDefault(_self.curItem)
			},
			
			newBinding : function (e){
			console.log(123)
				uni.navigateTo({
					url: '/pages/search/index'
				});
			},
			// 获取用户房间数据
			getMemberRoom: function (e) {
				var member_id  = uni.getStorageSync('user_id')
				uni.request({
					url: serviceUrl + 'personal_center/index',
					data: {
						member_id : member_id,
					},
					method:"GET",
					header : {'content-type':'application/json'},
					success: function (res) {
						console.log(res);
						if(res.data.status == 1){
							 console.log(res.data.data);
							 if(res.data.data){
								 _self.userRoomlist = res.data.data.list
								 _self.houseName = res.data.data.is_default.room_type_name+':'+res.data.data.is_default.full_room_name
								 _self.name = res.data.data.name
							 }
							
						}
					}
				});
			},
			// 切换为我的默认房产
			setDefault : function (e) {
				
				var member_id  = uni.getStorageSync('user_id')
				var e
				
				uni.request({
					url: serviceUrl + 'personal_center/set_default',
					data: {
						member_id		: member_id,
						user_room_id	: e,
					},
					method:"GET",
					header : {'content-type':'application/json'},
					success: function (res) {
						console.log(res);
						if(res.data.status == 1){
							uni.showToast({
								title: '切换成功'
							});
							
							uni.reLaunch({
								url: '/pages/index/index'
							});
							//console.log('操作完成！');
						}
					}
				});
			}
		}
	}
</script>

<style>
	@import url("../../static/css/switch.css");
</style>
