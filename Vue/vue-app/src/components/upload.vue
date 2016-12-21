<template>
 <div class="panel panel-primary">
 	<div class="panel-heading">上传插件</div>
 	<div class="panel-body">
	 	<div class="form">
	 		<div class="form-group row">
		 		<div class="col-sm-3">插件名称：</div>
		 		<div class="col-sm-9"><input ref="name" v-on:focus="hiddenPrompt" type="text" class="form-control" v-model="pluginName"></div>
	 		</div>
	 		<div class="form-group row">
		 		<div class="col-sm-3">版本号：</div>
		 		<div class="col-sm-9"><input type="text" v-on:focus="hiddenPrompt" class="form-control" v-model="pluginVersion"></div>
	 		</div>
	 		<div class="form-group row">
		 		<div class="col-sm-3">作者：</div>
		 		<div class="col-sm-9"><input type="text" v-on:focus="hiddenPrompt" class="form-control" v-model="pluginAuthor"></div>
	 		</div>
	 		<div class="form-group row">
		 		<div class="col-sm-3">选择文件：</div>
		 		<div class="col-sm-9"><input type="text" v-on:focus="hiddenPrompt" class="form-control" v-model="pluginFile"></div>
	 		</div>
	 		<div class="form-group row">
		 		<div class="col-sm-3">插件描述：</div>
		 		<div class="col-sm-9"><textarea class="form-control" v-on:focus="hiddenPrompt" v-model="pluginDescription"></textarea></div>
	 		</div>
	 	</div>
 	</div>
	<div class="panel-footer">
	<button class="btn btn-blue" @click="checkOutField">上传</button>
	</div>
 </div>
</template>

<script>
export default {
	data:function(){
		return {
			pluginName:"",
			pluginVersion:"",
			pluginAuthor:"",
			pluginFile:"",
			pluginDescription:""
		}
	},
	methods:{
		checkOutField:function(){
			var pluginName=this.pluginName;
			if(!pluginName){
				this.$parent.prompt.showPrompt=true;
				this.$parent.prompt.text="请填写插件名称";
				var x=this.$refs.name.getBoundingClientRect().left,
				h=this.$refs.name.getBoundingClientRect().height,
				y=this.$refs.name.getBoundingClientRect().top;
				var promptDom=this.$parent.$refs.prompt;
				if(promptDom){
					var promptDomWidth=promptDom.getBoundingClientRect().width,
						promptDomHeight=promptDom.getBoundingClientRect().height;
					this.$parent.prompt.type={"left":(x-promptDomWidth-10)+"px","top":(y+(y-h)/2)+"px"}
				}
				
			}
			
		},
		getParam:function(){

		},
		hiddenPrompt:function(){
			this.$parent.prompt.showPrompt=false;
		}
	},
	watch:{
		setPromptPos:function(){

		}
	}
}
</script>
