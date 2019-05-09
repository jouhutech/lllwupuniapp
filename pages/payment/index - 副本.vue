<template>
	<view class="pay">
		<image class="payment-bj" src="/static/images/pay-bj.png"></image>
		<view class="pay-content">
			<view class="pay-position">
				<image src="/static/images/pay-position.png"></image>
				<view>{{room_name}}</view>
			</view>
			<view class="pay-time">
				<view class="pay-time-top">
					<text>上次缴费结束日期</text>
					<text>{{property_fee_endtime}}</text>
				</view>
				<view class="pay-time-bottom">
					<view class="pay-time-section">本次缴费区间</view>
					<view class="pay-time-bottom-cen">
						<text class="pay-time-data">{{property_fee_endtime}}</text>
						<text class="pay-time-symbol">~</text>
						<text class="pay-time-data">2018.08.01</text>
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
					<view class="explain-pric"><text>¥</text>6546.50</view>
				</view>
				<view class="pay-cost-list pay-cost-layout">
					<view class="list-surface">
						<checkbox-group>
							<label><checkbox value="" />装修垃圾清运费</label>
						</checkbox-group>
						<view class="pay-cost-section">
							<image src="/static/images/pay-section.png"></image>
							<text>2018.08.01~2019.04.01</text>
						</view>
						<view class="pay-cost-price">3000.00</view>
					</view>
					<view class="list-surface">
						<checkbox-group>
							<label><checkbox value="" />车库维护费</label>
						</checkbox-group>
						<view class="pay-cost-section">
							<image src="/static/images/pay-section.png"></image>
							<text>2018.08.01~2019.04.01</text>
						</view>
						<view class="pay-cost-price">1400.00</view>
					</view>
					<view class="list-surface">
						<checkbox-group>
							<label><checkbox value="" checked="checked" />二次供水费</label>
						</checkbox-group>
						<view class="pay-cost-section">
							<image src="/static/images/pay-section.png"></image>
							<text>2018.08.01~2019.04.01</text>
						</view>
						<view class="pay-cost-price">2146.50</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pay-bottom">
			<view class="all-election">
				<checkbox-group>
					<label><checkbox value="" checked="checked" />全选</label>
				</checkbox-group>
			</view>
			<view class="total-price">2146.50</view>
			<view class="fast-payment">立即缴费</view>
		</view>
	</view>
</template>

<script>
	var _self
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
				title : '小区',
				imageSrc : imageUrl[0],
				selectEffectClass : 0	,// 当前选择第几个
				room_name : '',
				room_id : '',
				property_fee_endtime:'',
				property_fee_next_endtime:'',
			}
		},
		onLoad() {
			var _self = this;
			uni.request({
				url: 'http://localhost/wxprogram/public/jmobile/village',
                data: {
                  'user_id': 1
                },
                method: 'GET',
                success: function (res) {
					console.log(res);
					var data = res.data;
					if (data.status == 1) {
						_self.room_name = data.data.full_room_name;
						_self.room_id = data.data.room_id;
						_self.property_fee_endtime = data.data.property_fee_endtime;
							
						var curDateArr = data.data.property_fee_endtime.split('-');
						var curYear = Number(curDateArr[0]);
						var curMonth = Number(curDateArr[1]);
						var curDay = Number(curDateArr[2]);
						// 半年
						var addMonth = 6;
						var addYear = 0;
						
						// 赋值time-max
						var maxCurDate = this->getDateStr(curYear,curMonth,curDay,addYear,addMonth);
						console.log(maxCurDate);
						
						
					} else {
						wx.showToast({
						  title: data.info,
						  icon: 'none',
						  duration: 2000
						})
					}
                },
                fail: function () {
					wx.showToast({
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
				_self.selectEffectClass = e
				_self.imageSrc = imageUrl[e]
			},
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
            
		},
		watch: {
			room_id () {

				//var _self = this;
				
				//console.log(this.room_id)
			}
		}
	}
</script>

<style>
	@import url("../../static/css/payment.css");
</style>
