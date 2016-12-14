<template>
  <nav class="navbar navbar-inverse navbar-fixed-top no-bordered" role="navigation">
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
            <li  @click='setActiveNav(navLeft.text)' v-for="navLeft in nav" :class="{active:active==navLeft.text}"><router-link :to="navLeft.link">{{navLeft.text}}</router-link></li>
          </ul>
          <form class="navbar-form navbar-right" role="search" v-if="search.show">
            <div class="form-group">
              <input class="form-control" :placeholder="search.placeHolder" type="text">
            </div>
            <button type="submit" class="btn btn-blue">{{search.btnText}}</button>
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
      this.$parent.navData.activeName=name;
      this.$parent.showView=name==='说明文档'?true:false;
    }
  }
}
</script>
<style>
.navbar.navbar-inverse.no-bordered{ border-radius:0px; margin:0;}
.navbar-inverse ul.navbar-nav > li > a{color:#337ab7;}
.navbar-inverse ul.navbar-nav > li > a:hover{ color:#337ab7;background:#111111;}
.navbar-inverse ul.navbar-nav > .active > a,
.navbar-inverse ul.navbar-nav > .active > a:focus, 
.navbar-inverse ul.navbar-nav > .active > a:hover{background:#111111;color:#337ab7;}
.navbar-inverse .navbar-header .navbar-brand,.navbar-inverse .navbar-header .navbar-brand:hover{color:#337ab7;}

.btn.btn-blue{ color:#337ab7;background:#323232;border-color:#337ab7;}
.btn.btn-blue:hover,.btn.btn-blue:focus{ color:#337ab7; box-shadow:0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(102, 175, 233, 0.6)}
.navbar-form .form-control{ background:#111111;border-color:#337ab7;color:#337ab7;}
</style>
