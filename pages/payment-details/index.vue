<template>
	<view class="payment-details">
		<view class="payment-details-top">
			<view class="payment-details-pad_top">此历史缴费时间</view>
			<view class="details-top-project">
				<text>{{fetch_fee_time}}</text>
				<text>共计：{{use_real_money}}</text>
			</view>
		</view>
		<view class="payment-details-top">
			<view class="list" v-for="(data, keys) in details" :key="keys">
				<view class="payment-details-pad_top">{{data.fee_name}}</view>
				<view class="details-top-project">
					<text class="details-top-data" v-if="data.cate!=3">{{data.start_time}}至{{data.end_time}}</text>
					<text class="details-top-data" v-else>一次性费用</text>
					<text>{{data.use_real_money}}</text>
				</view>
			</view>
			<!-- <view>物业费</view>
			<view class="details-top-project">
				<text class="details-top-data">2018.08.01至2019.08.01</text>
				<text>1356.50</text>
			</view>
			<view>生活垃圾处理费</view>
			<view class="details-top-project">
				<text class="details-top-data">2018.08.01至2019.08.01</text>
				<text>4687.36</text>
			</view> -->
		</view>
	</view>
</template>

<script>
	import config from '../../common/config.js';
	var serviceUrl = config.serviceUrl
	var _self;
	var member_id = uni.getStorageSync('user_id')

	export default {
		data() {
			return {
				fee_order_id: 0,
				fetch_fee_time: '',
				use_real_money: '',
				details: []
			}
		},
		// onLoad() {
		onLoad: function(option) {
			_self = this
			_self.fee_order_id = option.fee_order_id
			_self.getFeeOrderInfo();
		},
		methods: {
			
			// 获取缴费订单详情
			getFeeOrderInfo: function() {
				var member_id = uni.getStorageSync('user_id')
				uni.request({
					url: serviceUrl + 'personal_center/getFeeOrderInfo',
					data: {
						member_id: member_id,
						fee_order_id: _self.fee_order_id,
					},
					method: "GET",
					header: {
						'content-type': 'application/json'
					},
					success: function(res) {
						console.log(res);
						if (res.data.status == 1) {
							_self.fetch_fee_time = config.DateToTime(res.data.data.fetch_fee_time) // 收款日期

							_self.use_real_money = res.data.data.use_real_money // 实际花费金额
							_self.details = res.data.data.details // 详情

							for (let key in _self.details) {
								_self.details[key]['end_time'] = config.DateToTime(_self.details[key]['end_time'])
								_self.details[key]['start_time'] = config.DateToTime(_self.details[key]['start_time'])

							};

						}
					}
				});
			},
		},
	}
</script>

<style>
	@import url("../../static/css/payment-details.css");
</style>
