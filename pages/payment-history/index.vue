<template>
	<view class="payment-history">
		<view class="payment-history-top">
			<view class="payment-history-padd">
				<view class="history-top-title">此历史缴费时间</view>
				<view class="history-top-time">
					<picker mode="date" :value="date" :start="startDate" @change="startDateChange">
						<view class="uni-input">{{start_time}}</view>
					</picker>
					<text>至</text>
					<picker mode="date" :value="date" :end="endDate" @change="endDateChange">
						<view class="uni-input">{{end_time}}</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="payment-history-top">
			<view class="order_list" v-for="(date,key) in fee_order_list" v-bind:key="key" v-bind:id="key" @click="look_details">
				<view class="history-top-title">	
					<text class="order_list_name" v-for="(details,details_key) in date.details" v-bind:id="details_key" v-bind:key="details_key">
						{{details.fee_type_name}}
						<!-- 物业费/生活垃圾处理费/水费/电费 -->
					</text>
				</view>
				<view class="details-top-project">
					<text class="details-top-data">{{date.create_time_name}}</text>
					<text>{{date.total_fee}}</text>
				</view>
			</view>
			<!-- <view class="history-top-title">物业费/生活垃圾处理费/水费/电费</view>
			<view class="details-top-project">
				<text class="details-top-data">2018.08.01至2019.08.01</text>
				<text>1356.50</text>
			</view>
			<view class="history-top-title">物业费/生活垃圾处理费</view>
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
	var _self, page = 1, timer = null;
	var member_id = uni.getStorageSync('user_id')
	var user_room_id = uni.getStorageSync('room_id')
	
	export default {
		data() {
			/*const currentDate = this.getDate({
				format: true
			})*/
			return {
				end_date: '',
				order_page : 1,
				order_page_size : 10,
				order_total : '',
				start_time:'',
				end_time:'',
				fee_order_list: new Array(),
			}
		},
		/*computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},*/
		onLoad() {
			_self = this
			_self.start_time = _self.getDate('start')
			_self.end_time = _self.getDate('end')
			
			_self.getFeeOrderList()
		},
		onReachBottom: function() {	// onReachBottom 页面上拉触底事件的处理函数
			if (timer != null) {
				clearTimeout(timer);	// 清除定时
			}
			timer = setTimeout(function() { // 添加定时
			
				_self.order_page = parseInt(_self.order_page)+parseInt(1)
				_self.getFeeOrderList();
			}, 1000);
		},
		methods: {
			startDateChange: function(e) {
				_self.start_time = e.target.value
				_self.getFeeOrderList()
			},
			endDateChange: function(e) {
				_self.end_time = e.target.value
				_self.getFeeOrderList()
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
			
				if (type === 'start') {
					year = year - 2;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			// 获取缴费订单列表
			getFeeOrderList : function (e) {
				var member_id = uni.getStorageSync('user_id')
				uni.request({
					url: serviceUrl + 'personal_center/getFeeOrderList',
					data: {
						member_id		: member_id,
						user_room_id	: user_room_id,
						page_size		: _self.order_page_size,
						page			: _self.order_page,
						start_time		: _self.start_time,
						end_time		: _self.end_time,
					},
					method:"GET",
					success: function (res) {
						var data = res.data.data
						if(res.data.status == 1){
							_self.order_page = _self.order_page
							_self.order_page_size = data.order_page_size
							_self.total = data.total
							if(_self.order_page == 1){
								_self.fee_order_list = data.fee_order_list
							} else {
								_self.fee_order_list = _self.fee_order_list.concat(data.fee_order_list)
							}
							
							for(let index in _self.fee_order_list) {
								_self.fee_order_list[index]['create_time_name'] = config.DateToTime(_self.fee_order_list[index]['create_time'],true)
							};
							console.log(_self.fee_order_list);
						}
					}
				});
			},
			look_details : function (e){
				var key = e.currentTarget.id
				uni.navigateTo({
					url: '/pages/payment-details/index?fee_order_id='+_self.fee_order_list[key]['fee_order_id']
				});
			}
		}
	}
</script>

<style>
	@import url("../../static/css/payment-history.css");
</style>

