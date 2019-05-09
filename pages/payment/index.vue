<template>
	<view class="pay">
		<image class="payment-bj" src="/static/images/pay-bj.png"></image>
		<view class="pay-content">
			<view class="pay-position" @click="redirectToUrl('/pages/switch/index')">
				<image src="/static/images/pay-position.png"></image>
				<view>{{data_obj.room_name}}</view>
			</view>
			<view class="pay-time">
				<view class="pay-time-top">
					<text>上次缴费结束日期</text>
					<text>{{data_obj.property_fee_endtime}}</text>
				</view>
				<view class="pay-time-bottom">
					<view class="pay-time-section">本次缴费区间</view>
					<view class="pay-time-bottom-cen">
						<text class="pay-time-data">{{data_obj.property_fee_next_starttime}}</text>
						<text class="pay-time-symbol">~</text>
						<text class="pay-time-data">{{data_obj.property_fee_next_endtime}}</text>
					</view>
				</view>
			</view>
			<view class="pay-data">
				<view class="pay-data-flex">
					<view :class="[selectEffectClass == 0 ? 'pay-data-content active' : 'pay-data-content']" @click="selectEffect(0)">
						<image class="pay-data-half" :src="imageSrc[0]"></image>
						<view class="pay-data-text">缴半年</view>
					</view>
				</view>
				<view class="pay-data-flex">
					<view :class="[selectEffectClass == 1 ? 'pay-data-content active' : 'pay-data-content']" @click="selectEffect(1)">
						<image class="pay-data-one" :src="imageSrc[1]"></image>
						<view class="pay-data-text">缴一年</view>
					</view>
				</view>
				<view class="pay-data-flex">
					<view :class="[selectEffectClass == 2 ? 'pay-data-content active' : 'pay-data-content']" @click="selectEffect(2)">
						<image class="pay-data-two" :src="imageSrc[2]"></image>
						<view class="pay-data-text">缴两年</view>
					</view>
				</view>
			</view>

			<view class="pay-cost">
				<view class="pay-cost-explain pay-cost-layout">
					<view class="explain-data">此时间段应缴</view>
					<view class="explain-pric"><text>¥</text>{{data_obj.price}}</view>
				</view>
				<view class="pay-cost-list pay-cost-layout">
					
					<view class="list-surface" v-for="(values, keys) in object" :key="keys">
						<checkbox-group >
						<label><checkbox :checked="fruitIds.indexOf(values.tmp_id+'-'+values.total_fee)>=0" @click='checkedOne(values.tmp_id+"-"+values.total_fee)' />{{values.fee_name}}</label>
						</checkbox-group>
						<view class="pay-cost-section">
							<image src="/static/images/pay-section.png"></image>
							<text v-if="values.cate!=3">{{data_obj.property_fee_next_starttime}}~{{data_obj.property_fee_next_endtime}}</text>
							<text v-else>一次性费用</text>
						</view>
						<view class="pay-cost-price">{{values.total_fee}}</view>
					</view>
					
					
				</view>
			</view>
		</view>
		<view class="pay-bottom">
			<view class="all-election">
				<checkbox-group >
					<label><checkbox :checked="isCheckedAll == true" @click='checkedAll()' />全选</label>
				</checkbox-group>
			</view>
			<view class="total-price">{{select_price}}</view>
			<view class="fast-payment" @click='submitFee()'>立即缴费</view>
		</view>
	</view>
</template>

<script>
	var _self
	import config from '../../common/config.js';  
	var serviceUrl = config.serviceUrl
	var imageUrl = [[
		'/static/images/pay-data-half.png',
		'/static/images/pay-data-one2.png',
		'/static/images/pay-data-two2.png'
	],[
		'/static/images/pay-data-half2.png',
		'/static/images/pay-data-one.png',
		'/static/images/pay-data-two2.png'
	],[
		'/static/images/pay-data-half2.png',
		'/static/images/pay-data-one2.png',
		'/static/images/pay-data-two.png'
	]]
	export default {
		data() {
			return {
				title : 'Hello',
				imageSrc : imageUrl[0],
				selectEffectClass : 0,	// 当前选择第几个
				data_obj: {
					room_name : '',
					room_id : '',
					property_fee_endtime: '',
					property_fee_next_starttime: '',
					property_fee_next_endtime: '',
					price: 0.00,
				},
				select_price : 0.00,
				object : [],
				fruitIds:[],
				isCheckedAll: false,
				openid : '',
			}
		},
		onLoad() {
			_self = this


			_self.openid = uni.getStorageSync('openId');
			
			//_self.data_obj.user_id = uni.getStorageSync('user_id');
// 			_self.data_obj.room_id = uni.getStorageSync('room_id');
// 			_self.data_obj.room_name = uni.getStorageSync('room_name');
			
			//获取默认房间及最后缴费时间
			uni.request({
				url: serviceUrl + 'village',
			    data: {
			      'user_id': uni.getStorageSync('user_id')
			    },
			    method: 'GET',
			    success: function (res) {
					console.log(res);
					
					var data = res.data;
		
					if (data.status == 1) {
						_self.data_obj.room_name = data.data.full_room_name;
						_self.data_obj.room_id = data.data.room_id;
						_self.data_obj.property_fee_endtime = data.data.property_fee_endtime;
						
						_self.data_obj.property_fee_next_starttime = data.data.property_fee_next_starttime;
			
						var curDateArr = data.data.property_fee_next_starttime.split('-');
						var curYear = Number(curDateArr[0]);
						var curMonth = Number(curDateArr[1]);
						var curDay = Number(curDateArr[2]);
						// 半年
						var addMonth = 6;
						var addYear = 0;
						
						// 赋值time-max
						_self.data_obj.property_fee_next_endtime = _self.getDateStr(curYear,curMonth,curDay,addYear,addMonth);
						var data_obj = _self.data_obj
						console.log(data_obj);
						_self.upDataobj( data_obj );
						
					} else {
						uni.showToast({
						  title: data.info,
						  icon: 'none',
						  duration: 2000
						})
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
			// 切换 半年 ， 一年 ，两年的 图片
			selectEffect: function (e) {
				_self.selectEffectClass = e;
				_self.imageSrc = imageUrl[e];
				
				var curDateArr = _self.data_obj.property_fee_next_starttime.split('-');
				var curYear = Number(curDateArr[0]);
				var curMonth = Number(curDateArr[1]);
				var curDay = Number(curDateArr[2]);
				if(e == 0){
					// 半年
					var addMonth = 6;
					var addYear = 0;
				}else if(e == 1){
					// 一年
					var addMonth = 0;
					var addYear = 1;
				}else if(e == 2){
					// 一年
					var addMonth = 0;
					var addYear = 2;
				}
				this.select_price = 0.00
				_self.isCheckedAll = false;
				// 赋值time-max
				_self.data_obj.property_fee_next_endtime = _self.getDateStr(curYear,curMonth,curDay,addYear,addMonth);
				var data_obj = _self.data_obj
				_self.upDataobj( data_obj );
				
				
				
			},
			//计算半年 一年 两年时间
			getDateStr(year,month,day,addYearCount,addMonthCount) {  
				var dd = new Date();
				//dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期  
				dd.setFullYear(year+addYearCount);//获取AddDayCount天后的日期  
				dd.setMonth(month-1+addMonthCount);//获取AddDayCount天后的日期
				dd.setDate(day-1);//获取AddDayCount天后的日期  
				var y = dd.getFullYear();  
				var m = (dd.getMonth()+1)<10 ? ('0'+(dd.getMonth()+1)) : (dd.getMonth()+1);  
				var d = dd.getDate() <10 ? ('0'+ dd.getDate()) :dd.getDate();
				return y+"-"+m+"-"+d; 
			},
			//获取需缴费信息
			upDataobj(obj){
				console.log(111);
				uni.request({
					url: serviceUrl + 'fee_order/check',
				    data: {
				      'room_id'    :    obj.room_id,
					  'start_time' : 	obj.property_fee_next_starttime,
					  'end_time'   :   	obj.property_fee_next_endtime,
				    },
				    method: 'GET',
				    success: function (res) {
						
						var data = res.data;
						console.log(data);
						if (data.status == 1) {
							
							_self.data_obj.price = data.data.total_fee;
							_self.object = data.data.tmp_order_list;
							//_self.checkedAll ();
							console.log(123);
							console.log(_self.object);
						} else {
							uni.showToast({
							  title: data.info,
							  icon: 'none',
							  duration: 2000
							})
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
			//点击缴费
			submitFee(){

				console.log(_self.fruitIds);
				console.log(_self.select_price);
				console.log(_self.data_obj.room_id);
				console.log(_self.openid);
				if(_self.select_price <= 0){
					uni.showToast({
						title: '请选择缴费项目',
						icon: 'none',
						duration: 2000
					})
				}else{
					uni.request({
						url: serviceUrl + 'fee_order/createOrder',
						data: {
							'room_id'      			:    	_self.data_obj.room_id,
							'tmp_id_arr' 				: 	 	_self.fruitIds.join(','),
							'total_use_real_money'   	:   	_self.select_price,
							'openid'   	:   	_self.openid,
						},
						method: 'POST',
						success: function (res) {
							var data = res.data;
							console.log(data);
		 					if (data.status == 1) {
		 						uni.requestPayment({
									timeStamp: data.data.timeStamp,
									nonceStr: data.data.nonceStr,   //字符串随机数
									package: data.data.package,
									signType: data.data.signType,
									paySign: data.data.paySign,
									'success': function (res) {
										console.log(11111111);    //requestPayment:ok==>调用支付成功
										console.log(res);

										uni.showToast({
											title: '缴费成功',//这里打印出报名成功
											icon: 'success',
											duration: 6000
										})
										
										uni.reLaunch({
											url: '/pages/index/index'
										})

									},
									'fail': function (res) {
										
										uni.showToast({
											title: '支付失败',//这里打印出报名成功
											icon: 'success',
											duration: 6000
										})
										console.log(123123)
										uni.reLaunch({
											url: '/pages/index/index'
										})
									
									},
									
								})
		 					} else {
		 						uni.showToast({
			 						title: data.info,
			 						icon: 'none',
			 						duration: 2000
		 						})
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
				}
				
				
			},
			checkedOne (fruitId) {
				let idIndex = this.fruitIds.indexOf(fruitId)
				if (idIndex >= 0) {
				  // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
				  this.fruitIds.splice(idIndex, 1)
				} else {
				  // 选中该checkbox
				  this.fruitIds.push(fruitId)
				}
				this.isCheckedAll = false;
				if(this.fruitIds.length == this.object.length && this.fruitIds.length>0){
					this.isCheckedAll = true;
				}
				
				this.select_price = 0.00;
				this.fruitIds.forEach(function (obj_fruitIds) {
					var price = obj_fruitIds.split("-");
					this.select_price = this.select_price+Number(price[1]);
				}, this);
				
				this.select_price = this.select_price.toFixed(2);
			},
			checkedAll () {
			  this.isCheckedAll = !this.isCheckedAll


			  if (this.isCheckedAll) {
			
				// 全选时
				this.fruitIds = [];
				this.select_price = 0.00;
				this.object.forEach(function (obj) {
				  this.fruitIds.push(obj.tmp_id+'-'+obj.total_fee);
				  this.select_price = this.select_price+Number(obj.total_fee);
				 
				}, this)
				this.select_price = this.select_price.toFixed(2);
			  } else {
		
				this.fruitIds = [];
				this.isCheckedAll = false;
				this.select_price = 0.00
			  }
			},
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

		
		},
	}
</script>

<style>
	@import url("../../static/css/payment.css");
</style>
