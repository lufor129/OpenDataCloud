<template>
  <v-app>
    <Loading :active.sync="isLoading"></Loading>
    <v-toolbar
      app
      :clipped-left="clipped"
      scroll-off-screen
    >
    <v-btn icon @click="home">
      <v-icon color="indigo">home</v-icon>
    </v-btn>
    <v-toolbar-title v-text="title"></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-text-field
      label="搜尋"
      color="blue"
      append-icon="search"
      v-model="search"
      @click:append="searching"
      clearable
    >
    </v-text-field>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      clipped: false,
      title: '開放資料文字雲',
      search:""
    }
  },
  methods:{
    searching:function(){
      if(this.search!=''){
        this.$store.dispatch("submitSearch",this.search);
        this.$router.push({path:"/search"});
      }
    },
    home(){
      this.$store.dispatch("submitSearch",'');
      this.$store.dispatch("submitCountys",[]);
      this.$router.push({path:"/"});
    }
  },
  computed:{
    isLoading() {
      return this.$store.state.isLoading;
    },
  }
}
</script>

<style>
 html,body{
   height:100%;
   margin:0;
   padding:0;
 }
</style>
