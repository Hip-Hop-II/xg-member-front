<template>
  <view class="my">
    <view class="card padding20">
      <view class="fontSize12 marginTop20">可提现余额(元)</view>
      <view class="money">{{convertFenToYuan(availableBalance)}}</view>
      <view @click="jumpPath(isShow === true?'withdrawPage': 'transferAccountsPage')"
            class="width120 btn-info marginTop20">{{isShow === true?'提现': '转账'}}</view>
    </view>
    <view class="moneyCard marginTop10" v-if="isShow">
      <view class="row_1 marginBottom20">{{isShow === true?'提现规则': '转账规则'}}</view>
      <view v-html="isShow === true?'' +
       '1. 每日5次提现机会<br>2. 每日累计提现额50000.00元':
       '1. 每日10次转账机会<br>2. 每日累计转账额100000.00元'"
            class="color666666 fontSize16"/>
    </view>
    <view class="moneyCard marginTop10">
      <view class="row_1 flex spaceBetween">
        <view>{{isShow === true?'提现记录': '转账记录'}}</view>
        <view @click="jumpPath(isShow === true?'withdrawQuery': 'transferAccountsQuery')"
              class="color666666 fontSize16 arrow_bg paddingRight20">查看更多</view>
      </view>
      <view class="item_list">
        <view class="marginTop20" v-for="item in listData" :key="item.id">
          <view class="item flex spaceBetween marginBottom10" v-if="!isShow">
            <view class="flex">
              <view class="mark">{{convertCode(item.settleType, settleTypeList)}}</view>
              <view class="color999999 fontSize12">{{item.fromMemberName}}</view>
            </view>
            <view class="paddingRight20 color666666 fontSize12">{{item.toMemberName}}</view>
          </view>
          <view class="item flex spaceBetween"
                @click="jumpPath(isShow === true?`detailsPage?title=提现&id=${item.id}`:`detailsPage?title=转账&id=${item.id}`)">
            <view>
              <view>编号：{{item.orderCode}}</view>
              <view class="color999999">{{timestampToDate(item.startTime)}}</view>
            </view>
            <view class="arrow_bg paddingRight20 text-align-right">
              <view>{{convertFenToYuan(isShow === true?item.money:item.settleMoney)}}</view>
              <view :class="styleType[item.status]">
                {{convertCode(item.statusCode, statusList)}}
              </view>
            </view>
          </view>
          <view v-if="item.statusCode === 'failed' && item.statusMsg"
                class="colorFF3333 text-align-center borderRadius backColorF7F7F7 fontSize12 marginTop10 padding10">{{item.statusMsg}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {inject, ref} from "vue";
import { onLoad } from '@dcloudio/uni-app';
import {accountInfoApi, fundWithdrawPageListApi, fundSettlementPageListApi} from '../../api/index'
import {convertFenToYuan, timestampToDate} from '../../utils/index'
const dayjs = inject('$dayjs')

const listData = ref([])
const availableBalance = ref()
const getAccountInfo = async () => {
  const res = await accountInfoApi({});
  if(res.data){
    availableBalance.value = res.data.availableBalance
  }else {
    uni.showToast({
      title: res.msg,
      icon: 'none'
    })
  }
}
getAccountInfo()

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
const settleTypeList = [
  {value: "settle_account", text: "转账至平台账户"},
  {value: "settle_bank", text: "结算至他人银行账户"},
  {value: "withdraw_self", text: "提现至同名银行账户"}
]
const convertCode = (code, list) => {
  const found = list.find(item => item.value === code);
  return found ? found.text : "";
};

// 转账 false, 提现 true
const isShow = ref(false)
onLoad((option)=>{
  if(option.type && option.type === '1'){
    isShow.value = false
    fundSettlementPageListApi({
      yyyy: dayjs(Date.now()).format('YYYY'),
      platformRole: 'platform',
      orderCode: '',
      statusCode: '',
      settleType: '',
      pageNum: 1,
      pageSize: 3
    }).then((res) => {
      if(res.code === 200){
        listData.value = res.data
      }
    })
  }else {
    isShow.value = true
    fundWithdrawPageListApi({
      yyyy: dayjs(Date.now()).format('YYYY'),
      platformRole: 'platform',
      orderCode: '',
      statusCode: '',
      bankName: '',
      pageNum: 1,
      pageSize: 3
    }).then((res) => {
      if(res.code === 200){
        listData.value = res.data
      }
    })
  }
})

const jumpPath = (path) => {
  uni.navigateTo({
    url: `/pages/subPack/${path}`
  })
}

</script>

