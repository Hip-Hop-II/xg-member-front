<template>
  <view class="detailsPage">
    <view class="backColorFFFFFF padding20 fontSize16">
      <view class="marginBottom20 flex spaceBetween">
        <view>编号</view>
        <view class="color666666">{{name === '订单'?list.id:list.orderCode}}</view>
      </view>
      <view class="marginBottom20 flex spaceBetween" v-if="name === '订单'">
        <view>商品名称</view>
        <view class="color666666">{{list.goodsName}}</view>
      </view>
      <view class="marginBottom20 flex spaceBetween" v-if="name === '订单'">
        <view>订单金额</view>
        <view class="color666666">{{convertFenToYuan(list.totalMoney)}}</view>
      </view>
      <view class="marginBottom20 flex spaceBetween" v-if="name !== '订单'">
        <view>{{name}}金额</view>
        <view class="color666666">{{convertFenToYuan(name === '提现'?list.money:list.settleMoney)}}</view>
      </view>
      <view class="marginBottom20 flex spaceBetween">
        <view>申请时间</view>
        <view class="color666666">{{timestampToDate(name === '订单'?list.createTime:list.startTime)}}</view>
      </view>
      <view class="marginBottom20 flex spaceBetween" v-if="name === '提现'">
        <view>银行名称</view>
        <view class="color666666">{{list.bankName}}</view>
      </view>
      <view class="marginBottom20 flex spaceBetween" v-if="name === '提现'">
        <view>银行卡号</view>
        <view class="color666666">{{list.bankCardNumber}}</view>
      </view>
      <view class="marginBottom20 flex spaceBetween" v-if="name === '转账'">
        <view>商户名称</view>
        <view class="color666666">{{list.fromMemberName}}</view>
      </view>
      <view class="marginBottom20 flex spaceBetween" v-if="name === '转账'">
        <view>入账账户</view>
        <view class="color666666">{{list.toMemberId}}</view>
      </view>
      <view class="marginBottom20 flex spaceBetween" v-if="name === '订单'">
        <view>结算比例</view>
        <view class="color666666">{{list.splitValue}}%</view>
      </view>
      <view class="marginBottom20 flex spaceBetween" v-if="name === '订单'">
        <view>结算金额</view>
        <view class="color666666">{{convertFenToYuan(list.settleMoney)}}</view>
      </view>
      <view class="marginBottom40 flex spaceBetween">
        <view>状态</view>
        <view :class="styleType[list.statusCode]">
          {{convertCode(list.statusCode, name === '订单'?statusOrderList: statusList)}}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import { onLoad } from '@dcloudio/uni-app';
import {fundWithdrawDetailApi, fundSettlementDetailApi, orderDetailApi} from '../../api/index'
import {convertFenToYuan, timestampToDate} from '../../utils/index'

const name = ref('')
onLoad((option)=>{
  if(option.title){
    name.value = option.title
    uni.setNavigationBarTitle({
      title: option.title + '明细'
    })
    getDetailsInfo(option.id)
  }
})

const list = ref({})
const getDetailsInfo = (id) => {
  if(name.value === '提现'){
    fundWithdrawDetailApi({id: id}).then((res) => {
      if(res.code === 200){
        list.value = res.data
      }
    })
  }else if(name.value === '转账'){
    fundSettlementDetailApi({id: id}).then((res) => {
      if(res.code === 200){
        list.value = res.data
      }
    })
  }else if(name.value === '订单'){
    orderDetailApi({id: id}).then((res) => {
      if(res.code === 200){
        list.value = res.data
      }
    })
  }
}

const styleType = {
  'success': 'color000000',
  'failed': 'colorFF3333',
  'approve': 'colorFF8D1A'
}
const statusList = [
  {value: "create", text: "起草中"},
  {value: "approve", text: "审核中"},
  {value: "deal", text: "待处理"},
  {value: "settle", text: "结算中"},
  {value: "settleFailed", text: "结算失败"},
  {value: "success", text: "已处理"},
  {value: "back", text: "退回"},
  {value: "failed", text: "失败"},
  {value: "cancel", text: "已撤销"}
]
const statusOrderList = [
  {value: "create", text: "待结算"},
  {value: "settle", text: "已结算"},
  {value: "freeze", text: "冻结中"},
  {value: "cancel", text: "撤销结算"}
]
const convertCode = (code, list) => {
  const found = list.find(item => item.value === code);
  return found ? found.text : "";
};
</script>

