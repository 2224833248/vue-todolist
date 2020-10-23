import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		user:{},
		taskList:{},
		count: 0,
		adList:{},
	},
	
	mutations: {
		increment(state,user) {
			state.user = user
		},
		upTaskList(state,taskList){
			state.taskList = taskList
		},
		editTask(state,info){
			for (let item of state.taskList) {
				for (let item1 of item) {
					if(item1.id==info.id){
						Object.assign(item1,info);
						break;
					}
				}
			}
		},	
		incover(state,discover){
			state.adList = discover
		}
	}
})

export default store