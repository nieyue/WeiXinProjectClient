<!--签到记录管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
  <Button type='primary' v-if="isSuperAdmin"  @click='add'>增加签到记录</Button>
    </div>
		 <!--新增 -->
     <Modal v-model="addSignRecordModel"
           title="新增签到记录管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="addSignRecord" :model="addSignRecord" :label-width="100" label-position="right"  :rules="addSignRecordRules">
        <FormItem prop="integral" label="奖励积分:">
            <InputNumber :max="1000000000" :min="0"  :precision='2'  v-model="addSignRecord.integral"></InputNumber>
        </FormItem>
         <FormItem prop="subscriptionId" label="公众号Id:">
          <Input type="text" v-model="addSignRecord.subscriptionId" placeholder="公众号Id">
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
     <Modal v-model="updateSignRecordModel"
           title="修改签到记录管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="updateSignRecord" :model="updateSignRecord" :label-width="100" label-position="right"  :rules="updateSignRecordRules">
        <FormItem prop="integral" label="奖励积分:">
            <InputNumber :max="1000000000" :min="0"  :precision='2'  v-model="updateSignRecord.integral"></InputNumber>
        </FormItem>
        <FormItem prop="subscriptionId" label="公众号Id:">
          <Input type="text" v-model="updateSignRecord.subscriptionId" placeholder="公众号Id">
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
      <Table border :columns='signRecordColumns' :data='signRecordList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :current="params.currentPage" :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
</template>
<script>

export default {
  name: 'SignRecord',
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
			addSignRecordModel:false,
			addLoading:false,
			addSignRecordRules: {
                integral: [
                    {type:"number",required: true, message: '必选项', trigger: 'change'}
                    ]
                },
			addSignRecord:{
			},
			//修改参数
			updateSignRecordModel:false,
			updateLoading:false,
			updateSignRecordRules: {
                integral: [
                     {type:"number",required: true, message: '必选项', trigger: 'change'}
                    ]
                },
			updateSignRecord:{
      },
        //删除参数
        deleteSignRecord:{},
	    signRecordList:[],
	    signRecordColumns: [
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
          title: '签到记录id',
          key: 'signRecordId',
          align:'center'
        },
        {
        	title:'公众号Id',
        	key:'subscriptionId',
            align:'center'
        },
        {
        	title:'奖励积分',
        	key:'integral',
            align:'center'
        },
        {
            title:'签到时间',
            key:'signDate',
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
       countUrl:'/signRecord/count',
       listUrl:'/signRecord/list',
       data:'signRecordList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addSignRecordModel = true
      this.addSignRecord={
           accountId:JSON.parse(this.$route.params.pathParams).accountId,
           subscriptionId:JSON.parse(this.$route.params.pathParams).subscriptionId,
		}
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addSignRecordModel = false
        this.$refs.addSignRecord.resetFields()
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
      ref:'addSignRecord',
      url:'/signRecord/add',
      requestObject:'addSignRecord',
      loading:'addLoading',
      showModel:'addSignRecordModel'
    })
    },
	 update (params) {
      this.updateSignRecordModel = true
      //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/signRecord/load?signRecordId='+params.signRecordId,
         data:'updateSignRecord',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateSignRecordModel = false
        this.$refs.updateSignRecord.resetFields()
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
    delete this.updateSignRecord.account
    delete this.updateSignRecord.subscription
    this.axiosbusiness.update(this,{
      ref:'updateSignRecord',
      url:'/signRecord/update',
      requestObject:'updateSignRecord',
      loading:'updateLoading',
      showModel:'updateSignRecordModel'
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
    this.deleteSignRecord={
      "signRecordId":params.signRecordId
    };
    this.axiosbusiness.delete(this,{
      url:'/signRecord/delete',
      requestObject:'deleteSignRecord'
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
