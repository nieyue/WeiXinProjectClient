<!--微信公众号菜单管理 -->
<template>
    <div class="body-wrap">
      <my-phone :model="2" ></my-phone>
    </div>
</template>
<script>

export default {
  name: 'WeixinMpMenu',
  data () {
    return {
        params:{
            startNum:1,//初始化个数
            currentPage:1,//当前页
            pageNum:1,//获取的第几个开始
            pageSize:10,//每页的个数
            total:0//总数
        },
			//增加参数
			addWeixinMpMenuModel:false,
			addLoading:false,
			addWeixinMpMenuRules: {
                integral: [
                    {type:"number",required: true, message: '必选项', trigger: 'change'}
                    ]
                },
			addWeixinMpMenu:{
			},
			//修改参数
			updateWeixinMpMenuModel:false,
			updateLoading:false,
			updateWeixinMpMenuRules: {
                integral: [
                     {type:"number",required: true, message: '必选项', trigger: 'change'}
                    ]
                },
			updateWeixinMpMenu:{
      },
        //删除参数
        deleteWeixinMpMenu:{},
	    weixinMpMenuList:[]
    }
  },
  methods: {
  //获取列表
   getList () {
     /**
     * 获取列表
     * $this  vue组件
     * p.countUrl 数量url
     * p.listUrl 列表url
     * p.list 返回列表
     */
        //根据id获取数据
    this.params.subscriptionId=JSON.parse(this.$route.params.pathParams).subscriptionId
     this.axiosbusiness.getList(this,{
       countUrl:'/weixinMpMenu/count',
       listUrl:'/weixinMpMenu/list',
       data:'weixinMpMenuList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addWeixinMpMenuModel = true
      this.addWeixinMpMenu={
           subscriptionId:JSON.parse(this.$route.params.pathParams).subscriptionId,
		}
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addWeixinMpMenuModel = false
        this.$refs.addWeixinMpMenu.resetFields()
      }
    },
		//增加确定
    addSure () {
       /**
     * 增加
     * $this  vue组件
     * p.ref 验证
     * p.url 增加url
     * p.requestObject 请求参数对象
     * p.loading loading
     * p.showModel 界面模型显示隐藏
     */
    this.axiosbusiness.add(this,{
      ref:'addWeixinMpMenu',
      url:'/weixinMpMenu/add',
      requestObject:'addWeixinMpMenu',
      loading:'addLoading',
      showModel:'addWeixinMpMenuModel'
    })
    },
	 update (params) {
      this.updateWeixinMpMenuModel = true
      //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/weixinMpMenu/load?weixinMpMenuId='+params.weixinMpMenuId,
         data:'updateWeixinMpMenu',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateWeixinMpMenuModel = false
        this.$refs.updateWeixinMpMenu.resetFields()
      }
    },
		//修改确定
    updateSure () {
      /**
     * 修改
     * $this  vue组件
     * p.ref 验证
     * p.url 修改url
     * p.requestObject 请求参数对象
     * p.loading loading
     * p.showModel 界面模型显示隐藏
     */
    delete this.updateWeixinMpMenu.subscription
    this.axiosbusiness.update(this,{
      ref:'updateWeixinMpMenu',
      url:'/weixinMpMenu/update',
      requestObject:'updateWeixinMpMenu',
      loading:'updateLoading',
      showModel:'updateWeixinMpMenuModel'
    })
 
    },
    //删除
    delete(params){
    /**
     * 删除
     * $this  vue组件
     * p.url 修改url
     * p.requestObject 请求参数对象
     */
    this.deleteWeixinMpMenu={
      "weixinMpMenuId":params.weixinMpMenuId
    };
    this.axiosbusiness.delete(this,{
      url:'/weixinMpMenu/delete',
      requestObject:'deleteWeixinMpMenu'
    })
    }
  },
  created () {
       //判断是否超级管理员
    this.isSuperAdmin=this.business.getIsSuperAdmin()
    //this.getList();
    
  },
  mounted () {

  }
}
</script>
