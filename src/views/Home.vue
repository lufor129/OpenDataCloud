<template>
  <v-container fluid>
    <v-layout align-center row mb-3>
      <v-flex xs5>
        <template v-for="(item,key) in secondSearch">
          <v-btn large color="success" :key="key" @click="relating(item,select,flag=false,back=secondSearch.length-key)">{{item}}</v-btn> > 
        </template>
      </v-flex>
      <v-flex  xs2>
        <h2>目前共: {{dataNum}} 筆</h2>
      </v-flex>
      <v-flex xs4 align-center>
        <v-combobox
          v-model="select"
          :items="items"
          label="選擇縣市"
          multiple
          chips
          color="#0D47A1"
          @input="changeselect"
        ></v-combobox>
      </v-flex>
      <v-flex  justify-center ml-5 xs1>
        <v-btn v-if="secondSearch.length>1" color="indigo" large outline @click="searching">列表</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row justify-space-between v-if="relateword.length!=0">
      <v-flex xs2>
        <v-card dark>
          <v-btn block dark large @click="relating(relateword[0],[],flag=true)" color="deep-orange">{{relateword[0]}}</v-btn>
        </v-card>
      </v-flex>
      <v-flex xs2>
        <v-card dark>
          <v-btn block dark large @click="relating(relateword[1],[],flag=true)" color="deep-orange lighten-3">{{relateword[1]}}</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
    <div id="wordcloud">
      <vue-word-cloud :words="words" :color="([, weight]) => weight > 100 ? '#74482a' : weight > 50 ? '#d1b022' : weight > 20 ? '#461e47' :'#31a50d'"  :enter-animation="enter">
        <template slot-scope="props">
					<v-tooltip top>
						<div
							slot="activator"
							style="cursor: pointer;"
							@click="onWordClick(props.word)"
						>{{ props.text }}</div>
						<div
							style="text-align: center;"
						>{{ props.text }}<br/>({{ props.weight }})</div>
					</v-tooltip>
				</template>
      </vue-word-cloud>
    </div>
    <v-layout row justify-space-between v-if="relateword.length!=0">
      <v-flex xs2>
        <v-card dark>
          <v-btn block dark large @click="relating(relateword[2],[],flag=true)" color="red darken-2">{{relateword[2]}}</v-btn>
        </v-card>
      </v-flex>
      <v-flex xs2>
        <v-card dark>
          <v-btn block dark large @click="relating(relateword[3],[],flag=true)" color="deep-orange lighten-1">{{relateword[3]}}</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default{
  name:"wordcloud",
  data() {
    return {
      words:[
        ["敬請",20],
        ["稍等",81],
        ["資料",72],
        ["快要",120],
        ["跑出來",64],
        ["請您",76],
        ["耐心",91],
        ["等待",86],
        ["真的",34],
        ["非常",55],
        ["抱歉",93],
        ["五秒鐘",117],
        ["即將",99],
        ["完成",39],
        ["十分",89],
        ["感謝",55],
      ],
      data:[],
      enter:{
        opacity: 0,
        transform: 'scale3d(0.1, 0.1, 1)'
      },
      unclick:[
        "敬請","稍等","資料","快要","跑出來","請您","耐心","等待","真的","非常","抱歉","五秒鐘","即將","完成","十分","感謝"
      ],
      items: [
          "臺北",
          "新北",
          "桃園",
          "新竹市",
          "臺南",
          "宜蘭",
          "新竹",
          "臺中",
          "高雄",
          "金門",
          "南投",
          "嘉義",
          "澎湖",
          "臺東",
          "屏東",
          "基隆",
          "苗栗",
          "彰化",
          "雲林",
          "嘉義縣",
          "花蓮",
          "連江"
      ],
      select: [],
      selectNoun:"",
      relateword:[],
      relatecolor:[
        "red darken-2",
        "deep-orange lighten-1",
        "deep-orange lighten-3",
        "deep-orange"
      ],
      secondSearch:[
        "縣市",
      ],
      dataNum:0
    }
  },
  methods:{
    onWordClick:function(word){
      if(this.unclick.includes(word[0]) || this.secondSearch.includes(word[0])){
        console.log(word[0]);
      }else{
        this.secondSearch.push(word[0]);
        this.relating(word[0],this.select);
      }
    },
    searching:function(){
      if(this.secondSearch.length>1){
        this.secondSearch.shift();
        this.$store.dispatch("submitSearch",this.secondSearch);
        this.$store.dispatch("submitCountys",this.select);
        this.$router.push({path:"/search"})
      }
    },
    relating:function(item,selectArr,flag=false,back=0){
      this.$store.dispatch("loading",true);
      this.select=selectArr;
      this.selectNoun=item;
      if(flag ==true){
        this.secondSearch = [];
        this.secondSearch.push("縣市");
        this.secondSearch.push(this.selectNoun);
      }
      for(let i=0;i<back-1;i++){
        this.secondSearch.pop();
      }
      let relate = flag == true ? true:false;
      const vm = this;
      this.$http.post(`${process.env.VUE_APP_API}/data/county`,{data:this.select,key:this.selectNoun,relate:relate,back:back}).then((response)=>{
        if(vm.selectNoun == '縣市'){
          vm.words = response.data.data;
        }else if(response.data.data.length>80){
          console.log(response.data.data.length);
          let temp = response.data.data;
          vm.words=temp.filter(function(item){
            return item[1]<200 && item[1]>7;
          });
        }else{
          vm.words = response.data.data;
        }
        vm.dataNum = response.data.dataNum;
        if(this.dataNum < 20){
          this.searching();
        }
        vm.$http.post(`${process.env.VUE_APP_API}/data/keyword`,{key:this.selectNoun}).then((response)=>{
          vm.relateword = response.data;
          this.$store.dispatch("loading",false);
        })
      })
    },
    changeselect:function(){
      const vm = this;
      this.$store.dispatch("loading",true);
      this.secondSearch = [];
      this.secondSearch.push("縣市")
      this.$http.post(`${process.env.VUE_APP_API}/data/county`,{data:this.select}).then((response)=>{
        vm.words = response.data.data;
        vm.selectNoun = "";
        vm.relateword = [];
        vm.$store.dispatch("loading",false);
      })
    }
  },
  created(){
    const vm=this;
    this.$store.dispatch("loading",true);
    this.$http.post(`${process.env.VUE_APP_API}/data/county`,{data:this.select}).then((response)=>{
      vm.words = response.data.data;
      vm.dataNum = response.data.dataNum;
      vm.$store.dispatch("loading",false);
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#wordcloud{
  height:40rem;
}
</style>
