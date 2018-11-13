<!--模板消息管理 -->
<template>
    <div class="body-wrap">
        <Alert type="warning">
            <p>微信公众号模板消息的规则:</p>
            <p>1.模板id需要在微信公众号后台配置后获取.</p>
            <p>2.模板内容需在公众号后台配置.比如content为领奖金额:{ {withdrawMoney.DATA} } 领奖时间:{ {withdrawTime.DATA} }，实际结果为"领奖申请\n\n领奖金额：xxxx元\n领奖时间：2013-10-10 12:22:22"</p>
        </Alert>
    <div class="body-btn-wrap">
      <Button type='primary'  @click='add'>增加模板消息</Button>
    <!-- qa -->
    </div>
		 <!--新增 -->
     <Modal v-model="addTemplateMessageModel"
           title="新增模板消息管理"
           :closable="false"
           :mask-closable="false"
             width="1000px"
    >
      <Form ref="addTemplateMessage" :model="addTemplateMessage" :label-width="100" label-position="right"  :rules="addTemplateMessageRules">
        <FormItem prop="teamplateId" label="模板id:">
          <Input type="text" v-model="addTemplateMessage.teamplateId" placeholder="模板id">
          </Input>
        </FormItem>
        <FormItem prop="title" label="模板标题（必填），与公众号一致:">
          <Input type="text" v-model="addTemplateMessage.title" placeholder="模板标题（必填），与公众号一致">
          </Input>
        </FormItem>
        <FormItem prop="url" label="模板跳转链接:">
          <Input type="text" v-model="addTemplateMessage.url" placeholder="模板跳转链接">
          </Input>
        </FormItem>
        <FormItem prop="appid" label="小程序的appid，有则跳小程序:">
          <Input type="text" v-model="addTemplateMessage.appid" placeholder="小程序的appid，有则跳小程序">
          </Input>
        </FormItem>
        <FormItem prop="pagepath"label="小程序的页面路径，跟app.json对齐，支持参数，比如pages/index/index?foo=bar:">
          <Input type="text" v-model="addTemplateMessage.pagepath" placeholder="小程序的页面路径，跟app.json对齐，支持参数，比如pages/index/index?foo=bar">
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
     <Modal v-model="updateTemplateMessageModel"
           title="修改模板消息管理"
           :closable="false"
           :mask-closable="false"
             width="1000px"
    >
      <Form ref="updateTemplateMessage" :model="updateTemplateMessage" :label-width="100" label-position="right"  :rules="updateTemplateMessageRules">
         <FormItem prop="teamplateId" label="模板id:">
          <Input type="text" v-model="updateTemplateMessage.teamplateId" placeholder="模板id">
          </Input>
        </FormItem>
        <FormItem prop="title" label="模板标题（必填），与公众号一致:">
          <Input type="text" v-model="updateTemplateMessage.title" placeholder="模板标题（必填），与公众号一致">
          </Input>
        </FormItem>
        <FormItem prop="url" label="模板跳转链接:">
          <Input type="text" v-model="updateTemplateMessage.url" placeholder="模板跳转链接">
          </Input>
        </FormItem>
        <FormItem prop="appid" label="小程序的appid，有则跳小程序:">
          <Input type="text" v-model="updateTemplateMessage.appid" placeholder="小程序的appid，有则跳小程序">
          </Input>
        </FormItem>
        <FormItem prop="pagepath"label="小程序的页面路径，跟app.json对齐，支持参数，比如pages/index/index?foo=bar:">
          <Input type="text" v-model="updateTemplateMessage.pagepath" placeholder="小程序的页面路径，跟app.json对齐，支持参数，比如pages/index/index?foo=bar">
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
      <Table border  :columns='templateMessageColumns' :data='templateMessageList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :current="params.currentPage"  :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
</template>
<script>
export default {
  name: 'TemplateMessage',
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
			addTemplateMessageModel:false,
			addLoading:false,
			addTemplateMessageRules: {
                url: [
                    {type:"string",required: true, message: 'url为必填项', trigger: 'blur'}
                    ],
                },
			addTemplateMessage:{
			},
			//修改参数
			updateTemplateMessageModel:false,
			updateLoading:false,
			updateTemplateMessageRules: {
                msgturlype: [
                    {type:"string",required: true, message: 'url为必填项', trigger: 'blur'}
                    ],
                },
			updateTemplateMessage:{
      },
        //删除参数
        deleteTemplateMessage:{},
	    templateMessageList: [],
	    templateMessageColumns: [
        {
          title: '序号',
          align:'center',
          width:100,
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '模板消息id',
          width:100,
          key: 'templateMessageId',
          align:'center'
        },
        {
            title:'模板id(公众号后台的模板消息id)',
            width:100,
            key:'teamplateId',
            align:'center'
        },
        {
            title:'模板标题（必填），与公众号一致',
            width:100,
            key:'title',
            align:'center'
        },
        {
            title:'模板内容（可选），与公众号一致，只做展示',
            width:300,
            //key:'content',
            align:'center',
            render:(h,params)=>{
                return h("div",[
                    h("div",params.row.content),
                    h("Button",{
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        on:{
                            click:()=>{
                                let pp=JSON.stringify({
                                    currentPage:1,
                                    templateMessageId:params.row.templateMessageId
                                });
                            this.$router.push("/main/templateData/"+pp)
                                }
                            }
                        },"配置数据规则")
                ]);
            }
        },
        {
            title:'模板跳转链接',
            width:100,
        	key:'url',
            align:'center'
        },
        {
        	title:'小程序的appid，要求小程序的appid需要与公众号有关联关系',
        	width:100,
             key:'appid',
            align:'center'
        },
        {
        	title:'小程序的页面路径，跟app.json对齐，支持参数，比如pages/index/index?foo=bar',
        	width:100,
            key:'pagepath',
            align:'center'
        },
        {
          title:'创建时间',
          width:100,
          key:'createDate',
          sortable: true,
          align:'center'
        },
        {
          title:'修改时间',
          width:100,
          key:'updateDate',
          sortable: true,
          align:'center'
        },
		{
          title: '操作',
          key: 'action',
          width:180,
          fixed:'right',
          align:'center',
          render: (h, params) => {
            var varhh1=  h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style:{
                  margin:'5px'
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
                style:{
                  margin:'5px'
                },
                on: {
                  click: () => {
                    this.delete(params.row)
                  }
                }
              }, '删除');
            var varhh3=  h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                style:{
                  margin:'5px'
                },
                style:{
                    margin:'12px  0'
                },
                on: {
                  click: () => {
                   this.sendTemplateMessage(params.row)
                  }
                }
              }, '群发消息');
            var varhh4=  h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style:{
                  margin:'5px'
                },
                style:{
                    margin:'12px  0'
                },
                on: {
                  click: () => {
                   this.sendSingleTemplateMessage(params.row)
                  }
                }
              }, '个人测试发送消息');
            	var s=h("div","");
			s=h("div",[
                h("div",[
              varhh1,
              varhh2
            ]),
            h("div",[
              varhh3,
              varhh4
            ])
            ]);
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
     * p.data 返回列表
     */
     this.params.subscriptionId=JSON.parse(this.$route.params.pathParams).subscriptionId
     this.axiosbusiness.getList(this,{
       countUrl:'/templateMessage/count',
       listUrl:'/templateMessage/list',
       data:'templateMessageList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addTemplateMessageModel = true
      this.addTemplateMessage={
          content:null
      }
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addTemplateMessageModel = false
        this.$refs.addTemplateMessage.resetFields()
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
    this.addTemplateMessage.subscriptionId=JSON.parse(this.$route.params.pathParams).subscriptionId
    this.axiosbusiness.add(this,{
      ref:'addTemplateMessage',
      url:'/templateMessage/add',
      requestObject:'addTemplateMessage',
      loading:'addLoading',
      showModel:'addTemplateMessageModel'
    })
    },
	 update (params) {
      this.updateTemplateMessageModel = true
      //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/templateMessage/load?templateMessageId='+params.templateMessageId,
         data:'updateTemplateMessage',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateTemplateMessageModel = false
        this.$refs.updateTemplateMessage.resetFields()
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
    this.axiosbusiness.update(this,{
      ref:'updateTemplateMessage',
      url:'/templateMessage/update',
      requestObject:'updateTemplateMessage',
      loading:'updateLoading',
      showModel:'updateTemplateMessageModel'
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
    this.deleteTemplateMessage={
      "templateMessageId":params.templateMessageId
    };
    this.axiosbusiness.delete(this,{
      url:'/templateMessage/delete',
      requestObject:'deleteTemplateMessage'
    })
    },
    //发送消息
    sendTemplateMessage(params){
    /**
     * post发送请求
     * $this  vue组件
     * p.url 修改url
     * p.title 名称
     * p.content 请求内容
     * p.requestObject 请求参数对象
     * p.success 成功回调
     */
    this.requestObject={
      "templateMessageId":params.templateMessageId
    };
    this.axiosbusiness.post(this,{
      url:'/templateMessage/sendTemplateMessage',
      title:'群发消息',
      content:'确定群发消息吗？',
      requestObject:'requestObject'
    })
    },
    //发送个人消息
    sendSingleTemplateMessage(params){
      /**
     * post发送请求
     * $this  vue组件
     * p.url 修改url
     * p.title 名称
     * p.content 请求内容
     * p.requestObject 请求参数对象
     * p.success 成功回调
     */
   /*  this.requestObject={
      "url":this.axios.defaults.baseURL+"/home/mp.html?templateMessageId="+params.templateMessageId
    }; */
    this.axios({
          method:"post",
          //url:'/tool/getQrCode?url=http://ccsd.tea18.cn/home/mp.html?templateMessageId='+params.templateMessageId,
          url:'/tool/getQrCode?url='+this.axios.defaults.baseURL+"/home/mp.html?templateMessageId="+params.templateMessageId,
         // data:JSON.stringify(this.requestObject),
          withCredentials: true,  
          responseType:'blob'
          })
        .then((res)=>{
          var blob = new Blob([res.data], {type: "image/png"}); 
          var imgurl=window.URL.createObjectURL(blob);
          console.log(imgurl)
          this.$Modal.success({
            title: "扫一扫发送个人消息",
            content: "<img src="+imgurl+" style='width:100px;height:100px;'/>"
          });
        }).catch((error)=>{
            console.log(error);
            this.$Message.error("错误")
         });

    }
  },
   watch: {
    //当前页面参数修改动态启动
      $route (to,from){
        this.selectPage(JSON.parse(this.$route.params.pathParams).currentPage)
      }
    }, 
  created () {
    this.selectPage(JSON.parse(this.$route.params.pathParams).currentPage)
  },
  mounted () {

  }
}
</script>
