export default{
	data:function(){
		return {
			title:"组件调用"
		}
	},
	methods:function(){
		return {
			setTitle:function(){
				alert(this.title)
			}
		}
	}
}