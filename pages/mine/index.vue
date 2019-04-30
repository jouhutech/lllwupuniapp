<template>
	<view class="mine">
		<view class="mine-content">
			<image class="mine-edit" src="/static/images/mine-edit.png"></image>
			<image class="mine-logo" :src="avatarUrl"></image>
			<view>
				<text class="mine-title">{{nickName}}</text>
				
			</view>
			<view class="mine-house" @click="look_search">
				<view class="mine-house-house">我的房产</view>
				<view class="mine-house-content" >
					<text class="text-left">{{houseName}}</text>
					<text class="text-right" >更多房产 ></text>
				</view>
			</view>
			<view class="mine-pay-history" @click="look_pay">
				<text>我的缴费历史</text>
				<image class="pay-img" src="/static/images/mine-gold.png"></image>
			</view>
			<button class="mine-btn" @click="logout">退出账号</button>
		</view>
		<view class="footer">
			
			<view class="f-menu" @click="redirectToUrl('/pages/index/index')">
				<image src="/static/images/home.png"></image>
			</view>
			<view class="f-menu" @click="redirectToUrl('/pages/mine/index')">
				<image src="/static/images/mine-b.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '../../common/config.js';  
	var serviceUrl = config.serviceUrl
	var _self;
	
	var member_id  = uni.getStorageSync('user_id')	// 用户id
	
	
	export default {
		data() {
			return {
				title: 'Exorcist class',
				houseName : '',
				name : '',
				avatarUrl: '',
				nickName : '',
			
			}
		},
		onLoad() {
			_self = this
			_self.getMemberRoom()	// 获取用户房间数据
			
			
		},
		onReady(){
			_self.avatarUrl = uni.getStorageSync('avatarUrl');
			_self.nickName = uni.getStorageSync('nickName');
		},
		methods: {
			// 获取用户房间数据
			getMemberRoom: function (e) {
				uni.request({
					url: serviceUrl + 'personal_center/index',
					data: {
						member_id : member_id,
					},
					method:"GET",
					header : {'content-type':'application/json'},
					success: function (res) {
						if(res.data.status == 1){
							if(res.data.data){
								if(res.data.data.is_default.full_room_name){
									_self.houseName = res.data.data.is_default.full_room_name;
								}else{
									_self.houseName = '';
								}
								
								_self.name = res.data.data.name
							}
							
							
						}
					}
				});
			},
			
			look_search : function (e){
				uni.navigateTo({
					url: '/pages/switch/index'
				});
			},
			look_pay : function (e){
				uni.redirectTo({
					url: '/pages/payment-history/index'
				});
			},
			logout : function (e){
				uni.clearStorageSync();
				uni.reLaunch({
					url: '/pages/login/index'
				});
			},
			//页面跳转
			redirectToUrl: function (url) {
				uni.navigateTo({
					url: url
				});
			},
			
		}
	}
</script>
<style>
	@import url("../../static/css/mine.css");
</style>
