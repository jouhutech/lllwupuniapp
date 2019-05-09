<template>
	<view class="login">
		<view>
			
			<!-- #ifdef APP-PLUS -->
			<!-- phone app login page -->
			<!-- judge user is auth if auth show phone number key login app have user write -->
			<image  class="login-logo" src="/static/images/logo.png"></image>
			<input class="login-input" v-model="phone_number" placeholder="请点击输入手机号并授权登录">
			<button class="login-btn"  @click="appLogin">
				<image class="login-wx" src="/static/images/login-wx.png"></image>
				<view class="login-font">{{app_login_btn}}</view>
			</button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<image class="login-logo" src="/static/images/logo.png"></image>
			<!-- wxprogram login page if have userinfo then view phome number key login bottom -->
			<button v-if="user_info_status"  class="login-btn"  open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				<image class="login-wx" src="/static/images/login-wx.png"></image>
				<view class="login-font">手机号一键登录</view>
			</button>
			<button v-else  class="login-btn" open-type='getUserInfo' @getuserinfo="appLogin">
				<image class="login-wx" src="/static/images/login-wx.png"></image>
				<view class="login-font">请先允许授权</view>
			</button>
			<!-- #endif -->
			
		</view>
		
	</view>
</template>

<script>
	var _self
	import config from '../../common/config.js';  
	var serviceUrl = config.serviceUrl
	export default {
		data() {
			return {
				app_login_btn: 'APP微信授权登录',
				bannerShow: false,
				user_info_status: false,
				phone_number: ''
			}
		},
		onLoad() {
			_self = this;
			// get save user_id if have a user_id into homepage
			if(uni.getStorageSync('user_id')){
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
			// #ifdef MP-WEIXIN
			// wxprogram user current set
			uni.getSetting({
				success: (res) => {
					//console.log('是否授权', res.authSetting['scope.userInfo'] !== undefined);
					// user auth result
					if(res.authSetting['scope.userInfo'] !== undefined){
						// judge openId
						if(!uni.getStorageSync('openId') ){
							uni.showToast({
							  title: '请重新授权',
							  icon: 'none',
							  duration: 2000
							})
							_self.user_info_status = false;
						}else{
							_self.user_info_status = true;
						}
					}else{
						_self.user_info_status = false;
					}
				}
			})
			// #endif
			

			
		},
		methods: {

			showBanner:function(){
				this.bannerShow=true;
			},
			hideBanner:function(){
				this.bannerShow=false;
			},
			// obtain user phone number
			getPhoneNumber: function(e) {
				//console.log(e);
				if (e.detail.encryptedData) {
					console.log(e);
					
					uni.login({
						success:(res)=>{
							uni.request({
							  url: serviceUrl + 'wx_user_info_decrypt/dateCrypt',
							  header:{'content-type':'application/json'},
							  data: {
								'js_code': res.code,
								'encryptedData':e.detail.encryptedData ,
								'iv':e.detail.iv ,
							  },
							  method: 'POST',
							  success: res => {
								console.log(res);
								if(!res.data){ 
									console.log('获取失败，请重试') 
									uni.showToast({ 
										title:'网络错误，请重试…' ,
										icon:'none' ,
										duration: 2000
									}) 
								}else{ 
									uni.setStorageSync('purePhoneNumber',res.data.purePhoneNumber);
									
									
									uni.request({
									  url: serviceUrl + 'login/index',
									  data: {
											unionid: uni.getStorageSync('unionId'),
											user_tel: res.data.purePhoneNumber,
									  },
									  method: 'POST',
									  success: res => {
											console.log(res);
											
											uni.setStorageSync('village_id',res.data.data.village_id);
											uni.setStorageSync('user_id',res.data.data.user_id);

											uni.showToast({ 
												title:'登录成功' ,
												icon:'none' ,
												duration: 2000
											}) 
											uni.reLaunch({
												url: '/pages/index/index'
											});
									  }
									})
								}
							  }
							})
						},
					})
				} 
			},
			// app user input phone
			appPhoneLogin: function() {
				var _this = this;
				uni.setStorageSync('purePhoneNumber',_this.phone_number);
				uni.request({
				  url: serviceUrl + 'login/index',
				  data: {
						unionid: uni.getStorageSync('unionId'),
						user_tel: _this.phone_number,
				  },
				  method: 'POST',
				  success: res => {
						console.log(res);
						
						uni.setStorageSync('village_id',res.data.data.village_id);
						uni.setStorageSync('user_id',res.data.data.user_id);

						uni.showToast({ 
							title:'登录成功' ,
							icon:'none' ,
							duration: 2000
						}) 
						uni.reLaunch({
							url: '/pages/index/index'
						});
				  }
				})
			
			},
			// app and wxprogram login button
			appLogin: function() { 
				// #ifdef APP-PLUS
				if (!(/^1[3456789]\d{9}$/.test(this.phone_number))) {
					uni.showToast({
						title: '手机号不正确',
						duration: 2000
					});
					return false;
				}
				_self.app_login_btn = '正在授权登录,请稍后...'
				// #endif
				uni.getProvider({ 
					service: 'oauth', 
					success: function(res) { 
						console.log(res.provider); //支持微信、qq和微博等 
						if (~res.provider.indexOf('weixin')) {
							uni.login({ 
								provider: 'weixin', 
								success: function(loginRes) {
									console.log('-------获取openid(unionid)-----'); 
									console.log(loginRes); // 获取用户信息 
									uni.getUserInfo({
										provider: 'weixin', 
										success: function(infoRes) {
											console.log('-------获取微信用户所有-----'); 
											console.log(infoRes); 
											//this.openid = infoRes.userInfo
											// #ifdef APP-PLUS
											console.log(JSON.stringify(infoRes)); 
											_self.user_info_status = true;
											uni.setStorageSync('openId',infoRes.userInfo.openId);
											uni.setStorageSync('unionId',infoRes.userInfo.unionId);
											uni.setStorageSync('nickName',infoRes.userInfo.nickName);
											uni.setStorageSync('avatarUrl',infoRes.userInfo.avatarUrl);
											console.log(uni.getStorageSync('openId'));
											console.log(uni.getStorageSync('unionId'));
											console.log(uni.getStorageSync('nickName'));
											_self.appPhoneLogin()
											// #endif
											// #ifdef MP-WEIXIN
											_self.getUnionId(loginRes.code,infoRes.iv,infoRes.encryptedData)
											// #endif
										} ,
									}); 
								} ,
							}); 
						} 
					} ,
				}); 
			},
			// 获取unionId
			getUnionId: function (code, iv, encrytedData) {

				uni.request({
				  url: serviceUrl + 'wx_user_info_decrypt/dateCrypt',
				  data: {
					'js_code': code,
					iv: iv,
					encryptedData: encrytedData
				  },
				  method: 'POST',
				  success: res => {
					console.log(res);
					_self.user_info_status = true;
					
					
					
					uni.setStorageSync('openId',res.data.openId);
					uni.setStorageSync('unionId',res.data.unionId);
					uni.setStorageSync('nickName',res.data.nickName);
					uni.setStorageSync('avatarUrl',res.data.avatarUrl);
					console.log(uni.getStorageSync('openId'));
					console.log(uni.getStorageSync('unionId'));
					console.log(uni.getStorageSync('nickName'));
					console.log(uni.getStorageSync('avatarUrl'));


				  }
				})
			},
		}
		
	}
</script>

<style>
	@import url("../../static/css/login.css");
</style>
