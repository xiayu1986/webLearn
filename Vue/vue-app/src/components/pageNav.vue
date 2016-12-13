<template>
  <nav class="navbar navbar-inverse navbar-fixed-top no-bordered" role="navigation">
  	<div class="navbar-header">
          <button type="button" class="navbar-toggle">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" :href="brand.link">{{brand.text}}</a>
    </div>
    <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav" v-if='nav.length'>
            <li  @click='setActiveNav(navLeft.text)' v-for="navLeft in nav" :class="{active:active==navLeft.text}"><a :href="navLeft.link">{{navLeft.text}}</a></li>
          </ul>
          <form class="navbar-form navbar-right" role="search" v-if="search.show">
            <div class="form-group">
              <input class="form-control" :placeholder="search.placeHolder" type="text">
            </div>
            <button type="submit" class="btn btn-default">{{search.btnText}}</button>
          </form>
          <ul  class="nav navbar-nav navbar-right" v-if='option.length'>
            <li @click='setActiveNav(navRight.text)' :class="{active:active==navRight.text}" v-for='navRight in option'><a :href="navRight.link">{{navRight.text}}</a></li>
          </ul>
    </div>
  </nav>
</template>

<script>
export default {
  props:['brand','nav','option','active','search'],
  methods:{
    setActiveNav:function(name){
      this.$parent.activeName=name
    }
  }
}
</script>
<style>
.navbar.navbar-inverse.no-bordered{ border-radius:0px; margin:0;}
</style>
