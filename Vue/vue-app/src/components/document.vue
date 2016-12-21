<template>
<div>
 	<div class="col-sm-3">
	 <ul class="list-group" v-if="menu.list.length">
	      <li  @click="setActiveItem(item.text,$event)" v-for="item in menu.list" class="list-group-item" :class="{itemActive:item.text==menu.active}">
			 <router-link :to="item.link">{{item.text}}</router-link>
		  </li>
	 </ul>
</div>
	<div class="col-sm-9">
		<router-view :panel="panel" name="panel"></router-view>
	</div>
</div>
</template>

<script>
import panel from './contentPanel.vue';
export default {
	props:['menu','panel'],
	methods:{
        setActiveItem:function(activeName,event){
          this.$parent.sideMenu.active=activeName;
          var isCurrent=event.currentTarget.className.indexOf("itemActive")>-1?true:false;
          if(isCurrent){
          	return;
          }
          this.$http.get('./src/data/panel.json')
              .then(function (res) {
              	this.$parent.panelData=res.body;
              },function (res) {

              })
              .catch(function (response) {

              })
        }
    }
}
</script>

