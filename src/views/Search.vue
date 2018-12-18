<template>
  <v-app>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs3>
          <v-card>
            <v-toolbar color="teal" dark>
              <v-toolbar-title class="text-xs-center">共{{Data.length}}筆 資料來源 : </v-toolbar-title>
            </v-toolbar>
            <v-list >
              <v-list-tile @click="change('')">
                <v-list-tile-content>
                  <v-list-tile-title>全部</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile
                v-for="(value, key, index) in DataSet"
                :key="index"
                @click="change(key)"
              >
                <v-list-tile-content>
                  <v-badge 
                    color="light-green lighten-1" 
                    dark 
                  >
                  <v-list-tile-title>{{ key }} 
                  </v-list-tile-title>
                  <span slot="badge">
                    {{value}}
                  </span>
                  </v-badge>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon
                    v-if="select!=key"
                    color="grey lighten-1"
                  >
                    star_border
                  </v-icon>
                  <v-icon
                    v-else
                    color="yellow darken-2"
                  >
                    star
                  </v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex xs8>
          <v-card style="float:left;margin:1%" width="48%" v-for="(item,index) in filterData" :key="index" color="green darken-1" class="white--text">
            <v-card-title primary-title>
              <div class="headline">{{item.資料集名稱}}</div> <br>
              <div>{{item['資料來源(部會單位)']}}</div>
            </v-card-title>
            <v-card-actions>
              <v-btn flat dark>Find Out</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default{
  name:"search",
  data(){
    return{
      select:""
    }
  },
  methods:{
    change:function(key){
      this.select = key;
    }
  },
  created(){
    if(this.$store.state.search==''){
      this.$router.push({path:"/"});
    }
    this.$store.dispatch("getSearching",{search:this.$store.state.search,countys:this.$store.state.countys});
  },
  computed:{
    Search(){
      return this.$store.state.search;
    },
    Data(){
      return this.$store.state.result;
    },
    DataSet(){
      return this.$store.state.resultset;
    },
    filterData(){
      if(this.select==''){
        return this.Data;
      }else{
        let temp = [];
        this.Data.forEach((item)=>{
          if(item['資料來源(部會單位)']==this.select){
            temp.push(item);
          }
        })
        return temp;
      }
    }
  }
}
</script>