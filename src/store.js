import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    search:"",
    countys:[],
    result:[],
    resultset:{}
  },
  mutations: {
    SEARCH(state, status){
      state.search = status;
    },
    COUNTYS(state, payload){
      state.countys = payload;
    },
    RESULT(state, payload){
      state.result = payload;
    },
    RESULTSET(state, payload){
      state.resultset = payload;
    }
  },
  actions: {
    submitSearch(context, data){
      context.commit("SEARCH", data);
    },
    submitCountys(context, data){
      context.commit("COUNTYS", data);
    },
    getSearching(context,{search,countys}){
      console.log(context.state.search);
      axios.post(`${process.env.VUE_APP_API}/data/search`,{search:search,countys:countys}).then((response)=>{
        console.log(response.data);
        context.commit("RESULT",response.data.result);
        context.commit("RESULTSET",response.data.dict);
      })
    }
  }
})
