<!-- 自定义wangeditor -->
<template>
    <div class="body-wrap">
        <div id="editor" style="text-align:left"></div>
    </div>
</template>
<script>
  export default {
    name: 'MyWangeditor',
      props:{
      //父组件传默认的值,string 
      updateContent:{
          type:String,
          required:false
      },
  },
    watch: { 
        //获取父组件的数据 
    updateContent: {  
    　　handler(newValue, oldValue) {  
        if(newValue){
            this.update()
         }else{
             this.add()
         }
        },
    　　deep: true  
    }, 
    },
    created(){ 
        let _this=this
        window.onload = function(){
            _this.init()
        }
        },
    data () {
      return {
          editor:new (this.wangeditor)("#editor"),
          //内容，默认null
          content:""
      }
    },
    methods: {
        init(){
            this.editor.customConfig.zIndex = 100
            this.editor.customConfig.onchange = (html) =>{
                this.content=html;
                this.$emit("editorContent", this.content)
            }
            this.editor.create();
            this.editor.txt.html("<p>输入内容...</p>")
        },
        add(){
            this.editor.txt.html('<p>输入内容...</p>')
        },
        update(){
           this.editor.txt.html(this.updateContent)
        }
    }
  }
</script>
