<template>
  <view class="withdrawQuery">
    <view class="screen">
      <view class="fontSize20 color000000 marginBottom10">日期</view>
      <view class="flex">
        <view v-for="item in switchList" :key="item.id"
              @click="switchClick(item.id)"
              :class="{'active': item.id === activeIndex}" class="switch">{{item.label}}</view>
      </view>
      <view class="gray marginTop20" v-if="activeIndex === 4">
        <uni-datetime-picker v-model="range" type="daterange" @change="datetimeChange" />
      </view>
      <view class="gray marginTop20 flex">
        <input v-model="orderCode" @change="search" type="text" class="input marginRight20" placeholder="请输入编号模糊查询"/>
        <uni-data-select v-model="status" :localdata="statusList"  @change="search"
                         placeholder="结算状态" class="uni_select"/>
      </view>
      <view class="gray marginTop10 borderRadius backColorF7F7F7">
        <uni-data-select v-model="classifyId" :localdata="classifyList"
                         placeholder="请选择产品分类" class="uni_select"/>
      </view>
    </view>
    <view class="item_list">
      <view v-for="item in listData" :key="item.id"
            @click="detailsPage(item.id)"
            class="marginTop10 backColorFFFFFF padding1020">
        <view class="item flex spaceBetween">
          <view class="mark">{{convertCode(item.statusCode, statusList)}}</view>
          <view class="colorFF3333">单笔{{item.splitValue}}%结算</view>
        </view>
        <view class="color000000 fontSize16 marginTop10">{{item.goodsName}}</view>
        <view class="item flex spaceBetween marginTop10">
          <view>
            <view class="color666666">编号：{{item.id}}</view>
            <view class="color999999">{{timestampToDate(item.createTime)}}</view>
          </view>
          <view class="arrow_bg paddingRight20 text-align-right">
            <view class="color666666">{{convertFenToYuan(item.totalMoney)}}</view>
            <view class="colorFF3333 fontSize18">{{convertFenToYuan(item.settleMoney)}}</view>
          </view>
        </view>
        <view v-if="item.statusMsg"
              class="colorFF3333 text-align-center borderRadius backColorF7F7F7 fontSize12 marginTop10 padding10">{{item.statusMsg}}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {inject, ref} from "vue";
import { onShow, onReachBottom } from '@dcloudio/uni-app';
import {orderPageListApi, merchantClassifyListApi} from '../../api/index';
import {convertFenToYuan, timestampToDate} from '../../utils/index'
const dayjs = inject('$dayjs')

onShow(() => {
  page.value = 1
  listData.value.splice(0)
  totalCount.value = 0
  getOrderQuery()
  merchantClassifyListApi({classifyType: 'goods'}).then(res => {
    if(res.data){
    }
  })
})

onReachBottom(() => {
  page.value++;
  if (page.value <= Math.ceil(totalCount.value / 10)) {
    getOrderQuery()
  }
})

const listData = ref([])
const range = ref([])
const orderCode = ref('')
const startTime = ref(dayjs().subtract(3, 'day').format('YYYY-MM-DD'))
const endTime = ref(dayjs(Date.now()).format('YYYY-MM-DD'))
const status = ref('')
const classifyId = ref('')
const page = ref(1)
const totalCount = ref(0)

const getOrderQuery = async () => {
  const res = await orderPageListApi({
    yyyy: dayjs(Date.now()).format('YYYY'),
    platformRole: 'platform',
    orderCode: orderCode.value,
    statusCode: status.value,
    classifyId: classifyId.value,
    form: startTime.value,
    to: endTime.value,
    pageNum: page.value,
    pageSize: 10
  });
  if(res.data){
    listData.value = res.data
    totalCount.value = res.data.total
  }
}

const activeIndex = ref(3)
const switchList = ref([
  {id: 3, label: '3日'},
  {id: 7, label: ' 7日'},
  {id: 15, label: ' 15日'},
  {id: 4, label: '自定义'}
])
const switchClick = (id) => {
  activeIndex.value = id
  if(id !== 4){
    startTime.value = dayjs().subtract(id, 'day').format('YYYY-MM-DD')
    endTime.value = dayjs(Date.now()).format('YYYY-MM-DD')
    getOrderQuery()
  }
}
const search = () => {
  page.value = 1
  listData.value.splice(0)
  totalCount.value = 0
  getOrderQuery()
}
const datetimeChange = () => {
  startTime.value = dayjs(range.value[0]).format('YYYY-MM-DD')
  endTime.value = dayjs(range.value[1]).format('YYYY-MM-DD')
  getOrderQuery()
}
const detailsPage = (id) => {
  uni.navigateTo({
    url: `/pages/subPack/detailsPage?title=订单&id=${id}`
  })
}
const styleType = {
  '成功': 'color000000',
  '失败': 'colorFF3333',
  '审核中': 'colorFF8D1A'
}
const statusList = [
  {value: "create", text: "待结算"},
  {value: "settle", text: "已结算"},
  {value: "freeze", text: "冻结中"},
  {value: "cancel", text: "撤销结算"}
]
const classifyList = ref([
  {value: "settle_account", text: "转账至平台账户"},
  {value: "settle_bank", text: "结算至他人银行账户"},
  {value: "withdraw_self", text: "提现至同名银行账户"}
])
const convertCode = (code, list) => {
  const found = list.find(item => item.value === code);
  return found ? found.text : "";
};
</script>
