<template>
  <view class="my padding20" v-if="isShow">
    <view class="head flex">
      钱包ID：{{ myInfo.accountId || '--' }}
      <text class="btn" @click="copyContent">一键复制</text>
    </view>
    <view class="marginTop10 marginBottom10 fontSize12">钱包ID用于转账用途钱包ID用于转账用途钱包</view>
    <view class="card padding20 borderRadius">
      <view class="imgText flex spaceBetween">
        <view>姓名：{{ myInfo.memberName || '--' }}</view>
        <view @click="jumpPath('personalCenter')">个人中心 ></view>
      </view>
      <view class="fontSize12 marginTop20">可提现余额(元)</view>
      <view class="money">{{ convertFenToYuan(myInfo.availableBalance || 0) }}</view>
      <view class="flex spaceBetween marginTop20">
        <view class="width120 btn-info" @click="jumpPath('personalWallet?type=1')">转账</view>
        <view class="width120 btn-info" @click="jumpPath('personalWallet?type=2')">提现</view>
      </view>
      <!--      <view class="text_tip" v-html="'因存在异常提现记录，平台数据核实中！<br>风控规则：临时关闭提现、转账等资金操作'">-->
    </view>
    <view class="moneyCard marginTop10">
      <view class="row_1 flex">
        <image mode="widthFix" src="/static/images/money_icon.png" />
        <text>我的收益</text>
      </view>
      <view class="flex spaceBetween marginTop20">
        <view>
          <view class="fontSize12 color666666">总收益(元)</view>
          <view class="fontSize20">{{ convertFenToYuan(myInfo.totalRevenue) || 0 }}</view>
        </view>
        <view>
          <view class="fontSize12 color666666">待结算(元)</view>
          <view class="fontSize20">{{ convertFenToYuan(myInfo.pendingSettlement) || 0 }}</view>
        </view>
        <view>
          <view class="fontSize12 color666666">已提现(元)</view>
          <view class="fontSize20">{{ convertFenToYuan(myInfo.withdrawn) || 0 }}</view>
        </view>
      </view>
    </view>
    <view class="moneyCard marginTop10">
      <view class="row_1 flex">
        <view>
          <image mode="widthFix" src="/static/images/data_icon.png" />
          <text>数据中心</text>
        </view>
        <!--        <view class="flex spaceBetween f_1 marginTop10 marginLeft20">-->
        <!--          <text class="fontSize12">05/10 12:31</text>-->
        <!--          <image mode="widthFix" src="/static/images/r_arrow.png" style="width: 12rpx;"/>-->
        <!--        </view>-->
      </view>
      <view class="flex spaceBetween marginTop20">
        <view class="text-align-center">
          <view class="fontSize12 color666666">今日订单金额</view>
          <view class="fontSize20">{{ convertFenToYuan(myInfo.todayPoMoney) || 0 }}</view>
        </view>
        <view class="text-align-center">
          <view class="fontSize12 color666666">今日订单数</view>
          <view class="fontSize20">{{ myInfo.todayPoNum || 0 }}</view>
        </view>
        <view class="text-align-center">
          <view class="fontSize12 color666666">今日下单人数</view>
          <view class="fontSize20">{{ myInfo.todayPoConsumerNum || 0 }}</view>
        </view>
      </view>
      <view class="flex spaceBetween marginTop10">
        <view class="text-align-center">
          <view class="fontSize12 color666666">今日结算金额</view>
          <view class="fontSize20">{{ convertFenToYuan(myInfo.todaySettlement) || 0 }}</view>
        </view>
        <view class="text-align-center">
          <view class="fontSize12 color666666">今日退款订单数</view>
          <view class="fontSize20">{{ myInfo.todayPoBackMoney || 0 }}</view>
        </view>
        <view class="text-align-center">
          <view class="fontSize12 color666666">今日退款金额</view>
          <view class="fontSize20">{{ myInfo.todayPoBackNum || 0 }}</view>
        </view>
      </view>
    </view>
    <view class="moneyCard marginTop10">
      <view class="marginBottom20 fontSize18 arrow_bg" @click="jumpPath('transferAccountsQuery')">转账记录</view>
      <view class="marginBottom20 fontSize18 arrow_bg marginTop10" @click="jumpPath('withdrawQuery')">提现记录</view>
      <view class="marginTop10 fontSize18 arrow_bg" @click="jumpPath('orderQuery')">订单记录</view>
    </view>
    <view v-if="showStatus.statusCode === 'created'" class="list flex spaceBetween marginTop10 padding20">
      <view class="flex">
        <view class="flex center img_bg marginRight20">
          <image mode="widthFix" src="/static/images/bell.png" />
        </view>
        <view>
          <view class="">未完成实名认证</view>
          <view class="fontSize12 color999999">请完成实名认证</view>
        </view>
      </view>
      <view class="btn_style" @click="jumpClick()">去认证</view>
    </view>
    <view v-if="showStatus.statusCode === 'apply'" class="list flex spaceBetween marginTop10 padding20">
      <view class="flex">
        <view class="flex center img_bg marginRight20">
          <image mode="widthFix" src="/static/images/bell.png" />
        </view>
        <view>
          <view class="">材料提交成功</view>
          <view class="fontSize12 color999999">请等待审核</view>
        </view>
      </view>
      <view></view>
    </view>
    <view v-if="showStatus.statusCode === 'failed'" class="list flex spaceBetween marginTop10 padding20">
      <view class="flex">
        <view class="flex center img_bg marginRight20">
          <image mode="widthFix" src="/static/images/bell.png" />
        </view>
        <view>
          <view class="">审核失败</view>
          <view class="fontSize12 color999999">{{ showStatus.statusName }}</view>
        </view>
      </view>
      <view class="btn_style" @click="jumpClick()">去提交</view>
    </view>
    <view v-if="showStatus.statusCode === 'unSign'" class="list flex spaceBetween marginTop10 padding20">
      <view class="flex">
        <view class="flex center img_bg marginRight20">
          <image mode="widthFix" src="/static/images/bell.png" />
        </view>
        <view>
          <view class="">认证成功</view>
          <view class="fontSize12 color999999">请注意查看签约短信</view>
        </view>
      </view>
    </view>
    <view v-if="showStatus.statusCode === 'sign'" class="list flex spaceBetween marginTop10 padding20">
      <view class="flex">
        <view class="flex center img_bg marginRight20">
          <image mode="widthFix" src="/static/images/bell.png" />
        </view>
        <view>
          <view class="">审核成功</view>
          <view class="fontSize12 color999999">请查看手机信息完成签约</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onShow } from '@dcloudio/uni-app';
import { openIdApi, accountInfoApi, getMemberInfoApi } from '../../api/index'
import { convertFenToYuan } from '../../utils/index'

onShow(() => {
  uni.login({
    provider: 'weixin', //使用微信登录
    onlyAuthorize: true, // 微信登录仅请求授权认证
    success(event) {
      const { code } = event
      openIdApi({
        appId: 'wx855f0626e4b48bc7',
        code: code,
      }).then((res) => {
        uni.setStorage({
          key: 'openId',
          data: res.data.openId
        })
        if (res.data.needLogin) {
          uni.navigateTo({
            url: '/pages/subPack/login'
          })
        } else {
          getMemberInfoApi({}).then((res) => {
            if (res.code === 200) {
              getAccountInfo()
              isShow.value = true
            }
          })
        }
      })
    }
  })
})

const myInfo = ref({})
const showStatus = ref({
  statusCode: '',
  nextStep: {}
})
const getAccountInfo = async () => {
  const res1 = await getMemberInfoApi({});
  if (res1.data) {
    showStatus.value = res1.data
  }

  const res = await accountInfoApi({});
  if (res.data) {
    myInfo.value = res.data
    myInfo.value.memberName = uni.getStorageSync('userInfo').memberName
  } else {
    uni.showToast({
      title: res.msg,
      icon: 'none'
    })
  }
}

const isShow = ref(false)

const copyContent = () => {
  uni.setClipboardData({
    data: myInfo.value.accountId,
    success: function () {
      uni.showToast({
        title: '复制成功',
        icon: 'success'
      })
    }
  })
}
const jumpClick = () => {
  // 去认证 或者 去提交
  if (showStatus.value.statusCode === 'created' && showStatus.value.nextStep && showStatus.value.nextStep.url) {
    goAuth(showStatus.value.nextStep.url)
  } else {
    if (showStatus.value.statusCode === 'created' || showStatus.value.statusCode === 'failed') {
      if (uni.getStorageSync('userInfo').memberType === 'company') {
        jumpPath('enterpriseInfo')
      } else {
        jumpPath('bankInfo?type=personal')
      }
    }
  }
}
const goAuth = (fadada_url) => {
  wx.navigateTo({
    url: "/pagesFace/pages/webview/webview?url=" + encodeURIComponent(fadada_url)
  });
}
const jumpPath = (path) => {
  uni.navigateTo({
    url: `/pages/subPack/${path}`
  })
}

</script>
