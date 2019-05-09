<template>
	<view class="binding">
		<view class="binding-block">
			<text class="binding-block-width_o">手机号码</text>
			<input type="text" class="binding-block-flex" maxlength="11" v-model="phone" @input="onKeyTelInput" placeholder="输入有效手机号" />
		</view>
		<view class="binding-block">
			<text class="binding-block-width_o">验证码</text>
			<input type="text" class="binding-block-flex" maxlength="6" v-model="phone_code" @input="onKeyCodeInput" placeholder="输入6位验证码" />
			<text class="binding-block-btn" v-if="show" @click="getCode">获取验证码</text>
			<text class="binding-block-btn" v-else>{{count}} s</text>
		</view>
		<view class="binding-btn" @click="getSub">完成</view>
	</view>
</template>

<script>
	import config from '../../common/config.js';  
	var serviceUrl = config.serviceUrl;
	var _self;
	export default {
		data() {
			return {
				show: true,
				count: '',
				timer: null,
				phone: '',
				phone_code: '',
				phone_old_code: '',
			}
		},
		onLoad() {
			_self = this
		},
		methods: {
			onKeyTelInput: function(event) {  
                this.phone = event.target.value  
            }, 
			
			
			onKeyCodeInput: function(event) {  
			    this.phone_code = event.target.value  
			}, 
			
			getSub(){
				
				var member_id  = uni.getStorageSync('user_id')	// 用户id
				
				if(this.phone == ''){
					uni.showToast({ 
						title:'请输入手机号码' ,
						icon:'none' ,
						duration: 2000
					}) 
					return false;
				}
				
				if(this.phone.length != 11){
					uni.showToast({ 
						title:'请输入正确的手机号码' ,
						icon:'none' ,
						duration: 2000
					}) 
					return false;
				}
				
				
				if(this.phone_old_code == ''){
					uni.showToast({ 
						title:'请获取验证码' ,
						icon:'none' ,
						duration: 2000
					}) 
					return false;
				}
				
				if(this.phone_old_code.length != 6){
					uni.showToast({ 
						title:'请获取六位验证码' ,
						icon:'none' ,
						duration: 2000
					}) 
					return false;
				}
				
				if(this.phone_code == ''){
					uni.showToast({ 
						title:'请输入验证码' ,
						icon:'none' ,
						duration: 2000
					}) 
					return false;
				}
				
				if(this.phone_code.length != 6){
					uni.showToast({ 
						title:'请输入六位验证码' ,
						icon:'none' ,
						duration: 2000
					}) 
					return false;
				}
				
				
				if(this.phone_code != this.phone_old_code){
					uni.showToast({ 
						title:'请输入正确的验证码' ,
						icon:'none' ,
						duration: 2000
					}) 
					return false;
				}
				
				uni.request({
					url: serviceUrl + 'login/upTel',
					data: {
						user_tel : this.phone,
						user_id : member_id
					},
					method:"POST",
					header : {'content-type':'application/json'},
					success: function (res) {
				
						uni.showToast({ 
							title:res.data.info,
							icon:'none' ,
							duration: 2000
						}) 
							
						if(res.data.status == 1){
							uni.setStorageSync('purePhoneNumber',_self.phone);
							uni.reLaunch({
								url: '/pages/mine/index',
							});
						}
					}
				});
			
				
			},
			getCode() {
				
				if(this.phone == ''){
					uni.showToast({ 
						title:'请输入手机号码' ,
						icon:'none' ,
						duration: 2000
					}) 
					return false;
				}
				
				if(this.phone.length != 11){
					uni.showToast({ 
						title:'请输入正确的手机号码' ,
						icon:'none' ,
						duration: 2000
					}) 
					return false;
				}
				
				uni.request({
					url: serviceUrl + 'send_sms/index',
					data: {
						mobile : this.phone,
					},
					method:"POST",
					header : {'content-type':'application/json'},
					success: function (res) {
				
						uni.showToast({ 
							title:res.data.info,
							icon:'none' ,
							duration: 2000
						}) 
			
						if(res.data.status == 1){
							_self.phone_old_code = res.data.data;
							
							const TIME_COUNT = 60;
							if (!_self.timer) {
								_self.count = TIME_COUNT;
								_self.show = false;
								_self.timer = setInterval(() => {
									if (_self.count > 0 && _self.count <= TIME_COUNT) {
										_self.count--;
									} else {
										_self.show = true;
										clearInterval(_self.timer);
										_self.timer = null;
									}
								}, 1000)
							}
							
							
						}
					}
				});
				
			}
		}
	}
</script>

<style>
	@import url("../../static/css/binding.css");
</style>
