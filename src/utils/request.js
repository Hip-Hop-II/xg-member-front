/**
 * 发送请求
 */
function baseRequest(url, method, data) {
	return new Promise((reslove, reject) => {
		uni.request({
			url: `${import.meta.env.VITE_API_HOST}/globalpay/comp${import.meta.env.VITE_API_PATH}${url}`,
			method: method || 'GET',
			header: {
				'content-type': 'application/json',
				'Auth-Token': uni.getStorageSync('userInfo').token
			},
			data: data || {},
			success: (res) => {
				if (res.data.code == 200) {
					reslove(res.data, res);
				}else if (res.data.code === 401) {
					uni.navigateTo({
            url: '/pages/subPack/login'
          })
				}else if ([410000, 410001, 410002].indexOf(res.data.code) !== -1) {
					reject(res.data.data);
				}else if (res.data.code == 500){
          uni.showToast({
            title: res.data.msg,
            icon: 'none'
          })
					reject(res.data.msg || '系统异常');
				}else if (res.data.code == 400){
					reject(res.msg || '参数校验失败');
				}else if (res.data.code == 404){
					reject(res.data.msg || '没有找到相关数据');
				}else if (res.data.code == 403){
					reject(res.data.msg || '没有相关权限');
				} else
					reject(res.data.msg || '系统错误');
			},
			fail: (msg) => {
				reject('请求失败');
			}
		})
	});
}

const request = {};

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
	request[method] = (api, data, opt, params) => baseRequest(api, method, data, opt || {}, params)
});

export default request;
