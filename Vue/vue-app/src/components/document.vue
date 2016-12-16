<template>
<div>
 	<div class="col-sm-3">
	 <ul class="list-group" v-if="menu.list.length">
	      <router-link tag="li" @click="setActiveItem(item.text)" v-for="item in menu.list" :to="item.link" class="list-group-item" :class="{itemActive:item.text==menu.active}">
			  {{item.text}}
		  </router-link>
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
        	console.log(activeName)
          this.$parent.sideMenu.active=activeName;
        }
    }
}
</script>

