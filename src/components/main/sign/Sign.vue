<!--签到管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
  <Button type='primary' v-if="isSuperAdmin"  @click='add'>增加签到</Button>
    </div>
		 <!--新增 -->
     <Modal v-model="addSignModel"
           title="新增签到管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="addSign" :model="addSign" :label-width="100" label-position="right"  :rules="addSignRules">
        <FormItem prop="dayNumber" label="连续天数:">
            <InputNumber :max="1000000000" :min="1"  :precision='0'  v-model="addSign.dayNumber"></InputNumber>
        </FormItem>
        <FormItem prop="integral" label="总积分:">
            <InputNumber :max="1000000000" :min="0"  :precision='2'  v-model="addSign.integral"></InputNumber>
        </FormItem>
         <FormItem prop="subscriptionId" label="公众号Id:">
          <Input type="text" v-model="addSign.subscriptionId" placeholder="公众号Id">
          </Input>
        </FormItem>
      </Form>
      <div slot='footer'>
        <Button type='ghost' @click='addCancel'>取消</Button>
        <Button type='primary' :loading='addLoading'>
          <span v-if="!addLoading" @click='addSure'>确定</span>
          <span v-else>Loading...</span>
        </Button>
      </div>
    </Modal>
    <!--新增end -->
		 <!--修改 -->
     <Modal v-model="updateSignModel"
           title="修改签到管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="updateSign" :model="updateSign" :label-width="100" label-position="right"  :rules="updateSignRules">
        <FormItem prop="dayNumber" label="连续天数:">
            <InputNumber :max="1000000000" :min="1"  :precision='0'  v-model="updateSign.dayNumber"></InputNumber>
        </FormItem>
        <FormItem prop="integral" label="总积分:">
            <InputNumber :max="1000000000" :min="0"  :precision='2'  v-model="updateSign.integral"></InputNumber>
        </FormItem>
        <FormItem prop="subscriptionId" label="公众号Id:">
          <Input type="text" v-model="updateSign.subscriptionId" placeholder="公众号Id">
          </Input>
        </FormItem>
        </Form>
      <div slot='footer'>
        <Button type='ghost' @click='updateCancel'>取消</Button>
        <Button type='primary' :loading='updateLoading'>
          <span v-if="!updateLoading" @click='updateSure'>确定</span>
          <span v-else>Loading...</span>
        </Button>
      </div>
    </Modal>
    <!--修改end -->
      <Table border :columns='signColumns' :data='signList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :current="params.currentPage" :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
</template>
<script>

export default {
  name: 'Sign',
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
			addSignModel:false,
			addLoading:false,
			addSignRules: {
                dayNumber: [
                     {type:"number",required: true, message: '必选项', trigger: 'change'}
                    ],
                integral: [
                    {type:"number",required: true, message: '必选项', trigger: 'change'}
                    ]
                },
			addSign:{
			},
			//修改参数
			updateSignModel:false,
			updateLoading:false,
			updateSignRules: {
                dayNumber: [
                     {type:"number",required: true, message: '必选项', trigger: 'change'}
                    ],
                integral: [
                     {type:"number",required: true, message: '必选项', trigger: 'change'}
                    ]
                },
			updateSign:{
      },
        //删除参数
        deleteSign:{},
	    signList:[],
	    signColumns: [
        {
          title: '序号',
          width:100,
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '签到id',
          key: 'signId',
          align:'center'
        },
        {
        	title:'公众号Id',
        	key:'subscriptionId',
            align:'center'
        },
        {
        	title:'openid',
        	key:'openid',
            align:'center'
        },
        {
        	title:'连续天数',
        	key:'dayNumber',
            align:'center'
        },
        {
        	title:'总积分',
        	key:'integral',
            align:'center'
        },
        {
            title:'创建时间',
            key:'createDate',
            sortable: true,
            align:'center'
        },
        {
        	title:'更新时间',
            key:'updateDate',
            sortable: true,
            align:'center'
        },
				{
          title: '操作',
          key: 'action',
          align:'center',
          render: (h, params) => {
            var varhh1=  h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginLeft: '10px'
                },
                on: {
                  click: () => {
                    this.update(params.row)
                  }
                }
              }, '编辑');
            var varhh2=  h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginLeft: '10px'
                },
                on: {
                  click: () => {
                    this.delete(params.row)
                  }
                }
              }, '删除');
                var s=h("div","");
                console.log(this.isSuperAdmin)
            if(this.isSuperAdmin){
                s=h("div",[
                    varhh1,
                    varhh2
            ]);
            }
            return s;
          }
        }
      ],
    }
  },
  methods: {
    //分页点击
    selectPage (currentPage) {
      this.params.currentPage=currentPage;
      this.params.pageNum = (this.params.currentPage-1)*this.params.pageSize+this.params.startNum;
     //构造path
     let pp=JSON.stringify({
       currentPage:currentPage,
       accountId:JSON.parse(this.$route.params.pathParams).accountId,
       subscriptionId:JSON.parse(this.$route.params.pathParams).subscriptionId
     })
     //console.log(this.$route.path.substr(0,this.$route.path.indexOf(this.$route.params.pathParams)))
      this.$router.push(this.$route.path.substr(0,this.$route.path.indexOf(this.$route.params.pathParams))+pp);
      this.getList()
    },
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
    this.params.accountId=JSON.parse(this.$route.params.pathParams).accountId
    this.params.subscriptionId=JSON.parse(this.$route.params.pathParams).subscriptionId
     this.axiosbusiness.getList(this,{
       countUrl:'/sign/count',
       listUrl:'/sign/list',
       data:'signList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addSignModel = true
      this.addSign={
           accountId:JSON.parse(this.$route.params.pathParams).accountId,
           subscriptionId:JSON.parse(this.$route.params.pathParams).subscriptionId,
		}
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addSignModel = false
        this.$refs.addSign.resetFields()
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
      ref:'addSign',
      url:'/sign/add',
      requestObject:'addSign',
      loading:'addLoading',
      showModel:'addSignModel'
    })
    },
	 update (params) {
      this.updateSignModel = true
      //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/sign/load?signId='+params.signId,
         data:'updateSign',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateSignModel = false
        this.$refs.updateSign.resetFields()
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
    delete this.updateSign.account
    delete this.updateSign.subscription
    this.axiosbusiness.update(this,{
      ref:'updateSign',
      url:'/sign/update',
      requestObject:'updateSign',
      loading:'updateLoading',
      showModel:'updateSignModel'
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
    this.deleteSign={
      "signId":params.signId
    };
    this.axiosbusiness.delete(this,{
      url:'/sign/delete',
      requestObject:'deleteSign'
    })
    }
  },
   watch: {
    //当前页面参数修改动态启动
      $route (to,from){
        this.selectPage(JSON.parse(this.$route.params.pathParams).currentPage)
      }
    }, 
  created () {
    //判断是否超级管理员
    this.isSuperAdmin=this.business.getIsSuperAdmin()
    this.selectPage(JSON.parse(this.$route.params.pathParams).currentPage)
    //this.getList();
    
  },
  mounted () {

  }
}
</script>
