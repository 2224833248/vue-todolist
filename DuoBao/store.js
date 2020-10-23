import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		user: {},
		taskList: {},
		adList: {},
		count: 0,
		setUp: {
			kxzb_examine: 1
		}
	},
	mutations: {
		increment(state, user) {
			state.user = user
		},
		setAdList(state, adList) {
			state.adList = adList
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
		}
	}
})

export default store
