module.exports = {
	test: function() {
		try {
			wx.setStorageSync("JDC_TEST", "1");
			wx.removeStorageSync("JDC_TEST");
			return true;
		} catch (e) {
			wx.showModal({
				title: "提示",
				content: "小程序缓存出现问题,请稍后使用",
				showCancel: !1,
				success: function(e) {
					if (e.confirm) {
						console.log("用户点击确定");
					}
				}
			})
			return false;
		}
	},
	set: function(name, value, expire) {
		if (typeof expire == "number") {
			expire = expire * 1e3;
		} else {
			expire = 2592e5
		}
		wx.removeStorageSync(name);
		var time = new Date().getTime();
		try {
			wx.setStorageSync(name, {
				_value: value,
				_time: time,
				_age: time + expire
			});
			return true;
		} catch (e) {
			return false;
		}
	},
	get: function(name) {
		var data = this._isExpire(name);
		if (data !== true) {
			return data._value
		} else {
			return ''
		}
	},
	del: function(name) {
		try {
			wx.removeStorageSync(name);
			return !0;
		} catch (e) {
			return !1;
		}
	},
	_isExpire: function(name) {
		try {
			var data = wx.getStorageSync(name);
		} catch (e) {}
		var time = new Date().getTime();
		if (data && time < data._age) {
			return data;
		} else {
			return true;
		}
	},
}
