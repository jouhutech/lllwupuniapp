<template>
	<view>
		<view class="index-content">
			<view class="index-content-top">
				<image class="index-position" src="/static/images/index-position.png"></image>
				<view v-if="data_obj.room_id" @click="redirectToUrl('/pages/switch/index')">{{data_obj.room_name}}</view>
				<view v-else @click="redirectToUrl('/pages/switch/index')">请先绑定房屋</view>
				<image class="index-arrow" src="/static/images/index-arrow.png"></image>
			</view>
			<view class="index-content-center">
				<image src="/static/images/index-img.png"></image>
				<view class="index-content-center-data">上次缴费结束日期</view>
				<view class="index-content-center-time" v-if="data_obj.room_id">{{data_obj.property_fee_endtime}}</view>
				<view class="index-content-center-time" @click="redirectToUrl('/pages/switch/index')" v-else >请先绑定房屋</view>
			</view>
			<view class="pay-btn" v-if="data_obj.room_id" @click="redirectToUrl('/pages/payment/index')">去缴费</view>
			<view class="pay-btn" v-else @click="redirectToUrl('/pages/switch/index')">去绑定房屋</view>
		</view>
		<view class="footer">
			
			<view class="f-menu">
				<image src="/static/images/home-b.png"></image>
			</view>
			<view class="f-menu" @click="redirectToUrl('/pages/mine/index')">
				<image src="/static/images/mine.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	var _self;
	import config from '../../common/config.js';  
	var serviceUrl = config.serviceUrl;
	export default {
		data() {
			return {
				data_obj: {
					room_name : '',
					room_id : '',
					property_fee_endtime: '',
				},
			}
		},
		onLoad() {
			_self = this
			
			
			//获取默认房间及最后缴费时间
			uni.request({
				url: serviceUrl + 'village',
			    data: {
			      'user_id': uni.getStorageSync('user_id')
			    },
			    method: 'GET',
			    success: function (res) {

					var data = res.data;
		
					if (data.status == 1) {
						if(data.data){
							_self.data_obj.room_name = data.data.full_room_name;
							_self.data_obj.room_id = data.data.room_id;
							_self.data_obj.property_fee_endtime = data.data.property_fee_endtime;
						}
						
					} 
			    },
			    fail: function () {
					uni.showToast({
						title: '参数失败',
						icon: 'none',
						duration: 2000
					})
			    }
			});
		},
		methods: {
			
			//页面跳转
			redirectToUrl: function (url) {
				if(url != '/pages/mine/index'){
					uni.navigateTo({
						url: url
					});
				}else{
					uni.reLaunch({
						url: url
					});
				}
				
			},
			
		}
	}
</script>

<style>
	@import url("../../static/css/index.css");
</style>
