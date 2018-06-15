<!--模板消息数据管理 -->
<template>
    <div class="body-wrap">
      <Alert type="warning">微信公众号模板消息的规则，模板数据名称，对应{ {name.DATA} }中的name，模板数据值，对应{ {name.DATA} }的转换值</Alert>
    <div class="body-btn-wrap">
      <Button type='primary'  @click='add'>增加模板消息数据</Button>
    <!-- qa -->
    </div>
		 <!--新增 -->
     <Modal v-model="addTemplateDataModel"
           title="新增模板消息数据管理"
           :closable="false"
           :mask-closable="false"
             width="1000px"
    >
      <Form ref="addTemplateData" :model="addTemplateData" :label-width="100" label-position="right"  :rules="addTemplateDataRules">
        <FormItem prop="name" label="模板数据名称，对应{ {name.DATA} }中的name:">
          <Input type="text" v-model="addTemplateData.name" placeholder="模板数据名称，对应{ {name.DATA} }中的name">
          </Input>
        </FormItem>
        <FormItem prop="value" label="模板数据值，对应{ {name.DATA} }的转换值:">
          <Input type="text" v-model="addTemplateData.value" placeholder="模板数据值，对应{ {name.DATA} }的转换值">
          </Input>
        </FormItem>
        <FormItem prop="color" label="模板数据值得颜色,格式：#ffffff:">
          <Input type="text" v-model="addTemplateData.color" placeholder="模板数据值得颜色,格式：#ffffff">
          </Input>
            <ColorPicker v-model="addTemplateData.color" />
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
     <Modal v-model="updateTemplateDataModel"
           title="修改模板消息数据管理"
           :closable="false"
           :mask-closable="false"
             width="1000px"
    >
      <Form ref="updateTemplateData" :model="updateTemplateData" :label-width="100" label-position="right"  :rules="updateTemplateDataRules">
         <FormItem prop="name" label="模板数据名称，对应{ {name.DATA} }中的name:">
          <Input type="text" v-model="updateTemplateData.name" placeholder="模板数据名称，对应{ {name.DATA} }中的name">
          </Input>
        </FormItem>
        <FormItem prop="value" label="模板数据值，对应{ {name.DATA} }的转换值:">
          <Input type="text" v-model="updateTemplateData.value" placeholder="模板数据值，对应{ {name.DATA} }的转换值">
          </Input>
        </FormItem>
        <FormItem prop="color" label="模板数据值得颜色，格式：#ffffff:">
  <Input type="text" v-model="updateTemplateData.color" placeholder="模板数据值得颜色,格式：#ffffff">
          </Input> 
           <ColorPicker v-model="updateTemplateData.color"  />
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
      <Table border :columns='templateDataColumns' :data='templateDataList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :current="params.currentPage"  :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
</template>
<script>
export default {
  name: 'TemplateData',
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
			addTemplateDataModel:false,
			addLoading:false,
			addTemplateDataRules: {
                name: [
                    {required: true, message: '必填项', trigger: 'blur'}
                    ],
                value: [
                    {required: true, message: '必填项', trigger: 'blur'}
                    ],
                color: [
                    {required: true, message: '必填项', trigger: 'blur'}
                    ],
                },
			addTemplateData:{
                color:'#000000'
			},
			//修改参数
			updateTemplateDataModel:false,
			updateLoading:false,
			updateTemplateDataRules: {
                name: [
                    {required: true, message: '必填项', trigger: 'blur'}
                    ],
                value: [
                    {required: true, message: '必填项', trigger: 'blur'}
                    ],
                color: [
                    {required: true, message: '必填项', trigger: 'blur'}
                    ],
                },
			updateTemplateData:{
                 color:'#000000'
             },
        //删除参数
        deleteTemplateData:{},
	    templateDataList: [],
	    templateDataColumns: [
        {
          title: '序号',
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '模板消息数据id',
          key: 'templateDataId',
          align:'center'
        },
        {
            title:'模板数据名称，对应{ {name.DATA} }中的name',
            key:'name',
            align:'center'
        },
        {
        	title:'模板数据值，对应{ {name.DATA} }的转换值',
        	key:'value',
            align:'center',
            render: (h, params) => {
                 return h('div', {
                     style:{
                         color:params.row.color
                     }
                 },params.row.value) 
            }
        },
        {
        	title:'模板数据值得颜色',
        	key:'color',
            align:'center',
          render: (h, params) => {
            return h('div', [
                h("div",params.row.color),
                h("div",{
                    style:{
                        heiht:'5px',
                        width:'5px',
                        backgroundColor:params.row.color
                    }
                }),

            ])
          }
        },
        {
          title:'创建时间',
          key:'createDate',
          sortable: true,
          align:'center'
        },
        {
          title:'修改时间',
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
                on: {
                  click: () => {
                    this.delete(params.row)
                  }
                }
              }, '删除');
            	var s=h("div","");
			s=h("div",[
              varhh1,
              varhh2
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
        templateMessageId:JSON.parse(this.$route.params.pathParams).templateMessageId,
     })
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
     this.params.templateMessageId=JSON.parse(this.$route.params.pathParams).templateMessageId
     this.axiosbusiness.getList(this,{
       countUrl:'/templateData/count',
       listUrl:'/templateData/list',
       data:'templateDataList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addTemplateDataModel = true
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addTemplateDataModel = false
        this.$refs.addTemplateData.resetFields()
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
    this.addTemplateData.templateMessageId=JSON.parse(this.$route.params.pathParams).templateMessageId
    this.axiosbusiness.add(this,{
      ref:'addTemplateData',
      url:'/templateData/add',
      requestObject:'addTemplateData',
      loading:'addLoading',
      showModel:'addTemplateDataModel'
    })
    },
	 update (params) {
      this.updateTemplateDataModel = true
      //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/templateData/load?templateDataId='+params.templateDataId,
         data:'updateTemplateData',
         success:()=>{
             this.updateColor=this.updateTemplateData.color
         }
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateTemplateDataModel = false
        this.$refs.updateTemplateData.resetFields()
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
      ref:'updateTemplateData',
      url:'/templateData/update',
      requestObject:'updateTemplateData',
      loading:'updateLoading',
      showModel:'updateTemplateDataModel'
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
    this.deleteTemplateData={
      "templateDataId":params.templateDataId
    };
    this.axiosbusiness.delete(this,{
      url:'/templateData/delete',
      requestObject:'deleteTemplateData'
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
    this.selectPage(JSON.parse(this.$route.params.pathParams).currentPage)
  },
  mounted () {

  }
}
</script>
