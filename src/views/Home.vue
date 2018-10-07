<template>
  <v-container fluid>
    <v-layout align-center justify-center row>
      <v-flex xs3 align-start>
        <v-card-text style="font-size:3rem" v-if="selectNoun.length!=0">{{selectNoun}}</v-card-text>
      </v-flex>
      <v-flex xs6 align-center>
        <v-combobox
          v-model="select"
          :items="items"
          label="選擇縣市"
          multiple
          chips
          color="#0D47A1"
        ></v-combobox>
      </v-flex>
      <v-flex  justify-center ml-5 xs2>
        <v-btn v-if="selectNoun!=''" color="indigo" large outline @click="searching">搜尋</v-btn>
      </v-flex>
    </v-layout>
    <div id="wordcloud">
      <vue-word-cloud :words="words" :color="([, weight]) => weight > 100 ? '#74482a' : weight > 40 ? '#d1b022' : '#31a50d'"  :enter-animation="enter">
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
    <v-layout row wrap v-if="relateword.length!=0">
      <v-flex xs12 sm6 md3 order-md4 order-sm2>
        <v-btn block dark large color="red darken-2">{{relateword[3]}}</v-btn>
      </v-flex>
      <v-flex xs12 sm6 md3 order-md3 order-sm1>
        <v-btn block dark large color="deep-orange lighten-1">{{relateword[2]}}</v-btn>
      </v-flex>
      <v-flex xs12 sm6 md3 order-md2 order-sm4>
        <v-btn block dark large color="deep-orange lighten-3">{{relateword[1]}}</v-btn>
      </v-flex>
      <v-flex xs12 sm6 md3 order-md1 order-sm3>
        <v-btn block dark large color="deep-orange">{{relateword[0]}}</v-btn>
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
      items: [
          "行政院",
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
      progress:undefined
    }
  },
  methods:{
    onWordClick:function(word){
      this.selectNoun  = word[0];
      const vm = this;
      this.$store.dispatch("loading",true);
      this.$http.post(`${process.env.VUE_APP_API}/data/county`,{data:this.select,key:this.selectNoun}).then((response)=>{
        if(response.data.length>100){
          let temp = response.data;
          vm.words=temp.filter(function(item){
            return item[1]<200 && item[1]>7;
          });
        }else{
          vm.words = response.data;
        }
        vm.$http.post(`${process.env.VUE_APP_API}/data/keyword`,{key:this.selectNoun}).then((response)=>{
          vm.relateword = response.data;
          this.$store.dispatch("loading",false);
        })
      })
    },
    searching:function(){
      if(this.selectNoun!=''){
        this.$store.dispatch("submitSearch",this.selectNoun);
        this.$store.dispatch("submitCountys",this.select);
        this.$router.push({path:"/search"})
      }
    }
  },
  created(){
    const vm=this;
    this.$store.dispatch("loading",true);
    this.$http.post(`${process.env.VUE_APP_API}/data/county`,{data:this.select}).then((response)=>{
      this.words = response.data;
      this.$store.dispatch("loading",false);
    })
  },
  watch:{
    select:function(){
      this.$store.dispatch("loading",true);
      this.$http.post(`${process.env.VUE_APP_API}/data/county`,{data:this.select}).then((response)=>{
        this.words = response.data;
        this.selectNoun = "";
        this.relateword = [];
        this.$store.dispatch("loading",false);
      })
    },
  }
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
