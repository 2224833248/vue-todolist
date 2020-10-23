import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		user:{},
		adList: {},
		taskList: {},
		count: 0,
		setUp: {
			kxzb_examine:''
		}
	},
	mutations: {
		increment(state,user) {
			state.user = user
		},
		setUp(state, setUp) {
			state.setUp = setUp
		},
		upTaskList(state, taskList) {
			state.taskList = taskList
		},
		editTask(state, info) {
			for (let key of Object.keys(state.taskList)) {
				let item = state.taskList[key];
				for (let item1 of item) {
					if (item1.id == info.id) {
						Object.assign(item1, info);
						break;
					}
				}
			}
		},
		setAdList(state, adList) {
			state.adList = adList
		}
	}
})

export default store