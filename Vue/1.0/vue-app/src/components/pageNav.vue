<template>
  <nav class="navbar navbar-inverse navbar-fixed-top no-bordered" role="navigation">
  <div class="container-fluid">
  	<div class="navbar-header">
          <button type="button" class="navbar-toggle">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <span class="navbar-brand">{{brand.text}}</span>
    </div>
    <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav" v-if='nav.length'>
            <li  @click='setActiveNav(navLeft.text,$event)' v-for="navLeft in nav" :class="{active:active==navLeft.text}"><router-link :to="navLeft.link">{{navLeft.text}}</router-link></li>
          </ul>
          <form class="navbar-form navbar-right" role="search" v-if="search.show">
            <div class="form-group">
              <input class="form-control" :placeholder="search.placeHolder" type="text">
            </div>
            <button type="submit" class="btn btn-blue">{{search.btnText}}</button>
          </form>
          <ul  class="nav navbar-nav navbar-right" v-if='option.length'>
            <li @click='setActiveNav(navRight.text,$event)' :class="{active:active==navRight.text}" v-for='navRight in option'><a :href="navRight.link">{{navRight.text}}</a></li>
          </ul>
    </div>
    </div>
  </nav>
</template>

<script>
export default {
  props:['brand','nav','option','active','search'],
  methods:{
    setActiveNav:function(name,event){
      this.$parent.navData.activeName=name;
      this.$parent.showView=name==='说明文档'?true:false;
      if(name==="下载插件" && !event.currentTarget.className){
        this.$http.get('./src/data/panel.json')
              .then(function (res) {
              
              },function (res) {

              })
              .catch(function (response) {

              })
      }
    }
  }
}
</script>

