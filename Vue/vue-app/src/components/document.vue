<template>
<div>
 	<div class="col-sm-3">
	 <ul class="list-group" v-if="menu.list.length">
	      <li  @click="setActiveItem(item.text)" v-for="item in menu.list" class="list-group-item" :class="{itemActive:item.text==menu.active}">
			 <router-link :to="item.link">{{item.text}}</router-link>
		  </li>
	 </ul>
</div>
	<div class="col-sm-9">
		<router-view></router-view>
	</div>
</div>
</template>

<script>
import panel from './contentPanel.vue';
export default {
	props:['menu'],
	methods:{
        setActiveItem:function(activeName){
          this.$parent.sideMenu.active=activeName;
        }
    }
}
</script>

