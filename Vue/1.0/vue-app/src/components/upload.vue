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
		 		<div class="col-sm-9"><input ref="version" type="text" v-on:focus="hiddenPrompt" class="form-control" v-model="pluginVersion"></div>
	 		</div>
	 		<div class="form-group row">
		 		<div class="col-sm-3">作者：</div>
		 		<div class="col-sm-9"><input ref="author" type="text" v-on:focus="hiddenPrompt" class="form-control" v-model="pluginAuthor"></div>
	 		</div>
	 		<div class="form-group row">
		 		<div class="col-sm-3">选择文件：</div>
		 		<div class="col-sm-9"><input ref="file" type="file" v-on:focus="hiddenPrompt" v-on:change="createFile" class="form-control"></div>
	 		</div>
	 		<div class="form-group row">
		 		<div class="col-sm-3">插件描述：</div>
		 		<div class="col-sm-9"><textarea ref="description" class="form-control" v-on:focus="hiddenPrompt" v-model="pluginDescription"></textarea></div>
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
			pluginDescription:"",
			show:false,
			errorRefs:null,
			$file: null,
            file: null
		}
	},
	methods:{
		checkOutField:function(){
			var pluginName=this.pluginName,
			pluginVersion=this.pluginVersion,
			pluginAuthor=this.pluginAuthor,
			pluginDescription=this.pluginDescription,
			pluginFile=this.$refs.file.value;
			if(!pluginName){//插件名称为空
				this.errorRefs=this.$refs.name;
				this.$parent.prompt.showPrompt=true;
				this.show=true;
				this.$parent.prompt.text="请填写插件名称";
				return;
			}

			if(!pluginVersion){//版本号为空
				this.errorRefs=this.$refs.version;
				this.$parent.prompt.showPrompt=true;
				this.show=true;
				this.$parent.prompt.text="请填版本号";
				return;
			}

			if(!pluginAuthor){//作者为空
				this.errorRefs=this.$refs.author;
				this.$parent.prompt.showPrompt=true;
				this.show=true;
				this.$parent.prompt.text="请填写作者名称";
				return;
			}

			if(!pluginFile){//文件为空
				this.errorRefs=this.$refs.file;
				this.$parent.prompt.showPrompt=true;
				this.show=true;
				this.$parent.prompt.text="请选择文件";
				return;
			}

			if(!pluginDescription){//插件描述
				this.errorRefs=this.$refs.description;
				this.$parent.prompt.showPrompt=true;
				this.show=true;
				this.$parent.prompt.text="请填写插件描述";
				return;
			}

			this.getParam();
			
		},
		getParam:function(){

		},
		hiddenPrompt:function(){
			this.$parent.prompt.showPrompt=false;
			this.show=false;
		},
		createFile:function(e){
			let file = e.target.files[0];
			let supportedTypes = ['rar','zip'];
			let fileType=file.name.replace(/.*\.(.*)/g,"$1");
			if (file && supportedTypes.indexOf(fileType) >= 0) {
				this.file = file;
				this.$parent.prompt.showPrompt=false;
				this.show=false;
			}else{
				this.errorRefs=this.$refs.file;
				this.$parent.prompt.showPrompt=true;
				this.show=true;
				this.$parent.prompt.text="仅支持rar或zip格式的文件";
			}
		}
	},
	watch:{
		show:function(newValue,oldValue){

			if(newValue){
				var x=this.errorRefs.getBoundingClientRect().left,
				h=this.errorRefs.getBoundingClientRect().height,
				y=this.errorRefs.getBoundingClientRect().top;
				var promptDom=this.$parent.$refs.prompt;
				if(promptDom){
					var promptDomWidth=promptDom.getBoundingClientRect().width,
						promptDomHeight=promptDom.getBoundingClientRect().height;
					this.$parent.prompt.type={"left":(x-promptDomWidth-10)+"px","top":(y+(h-promptDomHeight)/2)+"px"}
				}
			}
		}
	}
}
</script>
