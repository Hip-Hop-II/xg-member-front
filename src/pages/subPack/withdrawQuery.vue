<template>
  <view class="withdrawQuery">
    <view class="screen">
      <view class="fontSize20 color000000 marginBottom10">日期</view>
      <view class="flex">
        <view v-for="item in switchList" :key="item.id" @click="switchClick(item.id)"
          :class="{ 'active': item.id === activeIndex }" class="switch">{{ item.label }}</view>
      </view>
      <view class="gray marginTop20" v-if="activeIndex === 4">
        <uni-datetime-picker v-model="range" type="daterange" @change="datetimeChange" />
      </view>
      <view class="gray marginTop20 flex">
        <input v-model="orderCode" @change="search" type="text" class="input marginRight20" placeholder="请输入编号模糊查询" />
        <uni-data-select v-model="status" :localdata="statusList" @change="search" placeholder="提现状态"
          class="uni_select" />
      </view>
      <view class="gray marginTop10 borderRadius backColorF7F7F7">
        <!--        <uni-data-select v-model="bankName" :localdata="statusList"  @change="search"-->
        <!--                         placeholder="请选择入账银行" class="uni_select"/>-->
        <input v-model="bankName" @change="search" type="text" class="input marginRight20" placeholder="请输入入账银行" />
      </view>
    </view>
    <view class="item_list">
      <view v-for="item in listData" :key="item.id" @click="detailsPage(item.id)"
        class="marginTop10 backColorFFFFFF padding1020">
        <view class="item flex spaceBetween">
          <view>
            <view>编号：{{ item.orderCode }}</view>
            <view class="color999999">{{ timestampToDate(item.startTime) }}</view>
          </view>
          <view class="arrow_bg paddingRight20 text-align-right">
            <view>{{ convertFenToYuan(item.money) }}</view>
            <view :class="styleType[item.statusCode]">{{ convertCode(item.statusCode) }}</view>
          </view>
        </view>
        <view v-if="item.statusCode === 'failed' && item.statusMsg"
          class="colorFF3333 text-align-center borderRadius backColorF7F7F7 fontSize12 marginTop10 padding10">
          {{ item.statusMsg }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { inject, ref } from "vue";
import { onShow, onReachBottom } from '@dcloudio/uni-app';
import { fundWithdrawPageListApi } from '../../api/index';
import { convertFenToYuan, timestampToDate } from '../../utils/index'
const dayjs = inject('$dayjs')

onShow(() => {
  page.value = 1
  listData.value.splice(0)
  totalCount.value = 0
  getWithdrawQuery()
})

onReachBottom(() => {
  page.value++;
  if (page.value <= Math.ceil(totalCount.value / 10)) {
    getWithdrawQuery()
  }
})

const listData = ref([])
const range = ref([])
const orderCode = ref('')
const startTime = ref(dayjs().subtract(3, 'day').format('YYYY-MM-DD'))
const endTime = ref(dayjs(Date.now()).format('YYYY-MM-DD'))
const status = ref('')
const bankName = ref('')
const page = ref(1)
const totalCount = ref(0)

const getWithdrawQuery = async () => {
  const res = await fundWithdrawPageListApi({
    yyyy: dayjs(Date.now()).format('YYYY'),
    platformRole: 'platform',
    orderCode: orderCode.value,
    statusCode: status.value,
    bankName: bankName.value,
    form: startTime.value,
    to: endTime.value,
    pageNum: page.value,
    pageSize: 10
  });
  if (res.data) {
    listData.value = res.data
    totalCount.value = res.data.total
  }
}

const activeIndex = ref(3)
const switchList = ref([
  { id: 3, label: '3日' },
  { id: 7, label: ' 7日' },
  { id: 15, label: ' 15日' },
  { id: 4, label: '自定义' }
])
const switchClick = (id) => {
  activeIndex.value = id
  if (id !== 4) {
    startTime.value = dayjs().subtract(id, 'day').format('YYYY-MM-DD')
    endTime.value = dayjs(Date.now()).format('YYYY-MM-DD')
    getWithdrawQuery()
  }
}
const datetimeChange = () => {
  startTime.value = dayjs(range.value[0]).format('YYYY-MM-DD')
  endTime.value = dayjs(range.value[1]).format('YYYY-MM-DD')
  getWithdrawQuery()
}
const search = () => {
  page.value = 1
  listData.value.splice(0)
  totalCount.value = 0
  getWithdrawQuery()
}
const detailsPage = (id) => {
  uni.navigateTo({
    url: `/pages/subPack/detailsPage?title=提现&id=${id}`
  })
}

const styleType = {
  'success': 'color000000',
  'failed': 'colorFF3333',
  'approve': 'colorFF8D1A'
}
const statusList = [
  { value: "create", text: "起草中" },
  { value: "approve", text: "审核中" },
  { value: "deal", text: "待处理" },
  { value: "settle", text: "结算中" },
  { value: "settleFailed", text: "结算失败" },
  { value: "success", text: "已处理" },
  { value: "back", text: "退回" },
  { value: "failed", text: "失败" },
  { value: "cancel", text: "已撤销" }
]
const convertCode = (code) => {
  const found = statusList.find(item => item.value === code);
  return found ? found.text : "";
};
</script>
