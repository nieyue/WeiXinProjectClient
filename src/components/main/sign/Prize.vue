<!--奖品管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
      <Button type='primary'  @click='add'>增加奖品</Button>
    <!-- qa -->
    </div>
		 <!--新增 -->
     <Modal v-model="addPrizeModel"
           title="新增奖品管理"
           :closable="false"
           :mask-closable="false"
             width="1000px"
    >
      <Form ref="addPrize" :model="addPrize" :label-width="100" label-position="right"  :rules="addPrizeRules">
        <FormItem prop="dayNumber" label="连续天数:">
            <InputNumber :max="1000000000" :min="1"  :precision='0'  v-model="addPrize.dayNumber"></InputNumber>
        </FormItem>
        <FormItem prop="name" label="奖品名:">
          <Input type="text" v-model="addPrize.name" placeholder="奖品名">
          </Input>
        </FormItem>
        <FormItem prop="number" label="奖品数量:">
            <InputNumber :max="1000000000" :min="1"  :precision='0'  v-model="addPrize.number"></InputNumber>
        </FormItem>
        <FormItem prop="imgAddress" label="奖品图片(上传或者填写):" id="addImgAddressBox">
         <my-upload :defaultUpload="addPrize.imgAddress" @uploadList="getAddImgAddress"></my-upload> 
          <div>
            <Input type="text" v-model="addPrize.imgAddress" placeholder="url">
          </Input>
             <img :src="addPrize.imgAddress"  style='height:200px;width:300px;'alt="">
          </div>
        </FormItem>
        <FormItem prop="content" label="奖品内容:">
            <my-wangeditor  :content="addPrize.content" @getWangEditorContent="getAddEditor"></my-wangeditor>
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
     <Modal v-model="updatePrizeModel"
           title="修改奖品管理"
           :closable="false"
           :mask-closable="false"
             width="1000px"
    >
      <Form ref="updatePrize" :model="updatePrize" :label-width="100" label-position="right"  :rules="updatePrizeRules">
       <FormItem prop="dayNumber" label="连续天数:">
            <InputNumber :max="1000000000" :min="1"  :precision='0'  v-model="updatePrize.dayNumber"></InputNumber>
        </FormItem>
        <FormItem prop="name" label="奖品名:">
          <Input type="text" v-model="updatePrize.name" placeholder="奖品名">
          </Input>
        </FormItem>
        <FormItem prop="number" label="奖品数量:">
            <InputNumber :max="1000000000" :min="1" :precision='0'  v-model="updatePrize.number"></InputNumber>
        </FormItem>
        <FormItem prop="imgAddress" label="奖品图片(上传或者填写):" id="updateImgAddressBox">
          <my-upload :defaultUpload="updatePrize.imgAddress" @uploadList="getUpdateImgAddress"></my-upload> 
          <div>
            <Input type="text" v-model="updatePrize.imgAddress" placeholder="url">
          </Input>
             <img :src="updatePrize.imgAddress"  style='height:200px;width:300px;'alt="">
          </div>
        </FormItem>
        <FormItem prop="content" label="奖品内容:">
          <my-wangeditor :content="updatePrize.content" @getWangEditorContent="getUpdateEditor"></my-wangeditor>
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
      <Table border :columns='prizeColumns' :data='prizeList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :current="params.currentPage"  :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
</template>
<script>
export default {
  name: 'Prize',
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
			addPrizeModel:false,
			addLoading:false,
			addPrizeRules: {
                name: [
                    {required: true, message: '奖品名为必填项', trigger: 'blur'}
                    ],
                },
			addPrize:{
			},
			//修改参数
			updatePrizeModel:false,
			updateLoading:false,
			updatePrizeRules: {
                name: [
                    {required: true, message: '奖品名为必填项', trigger: 'blur'}
                    ],
                },
			updatePrize:{
      },
        //删除参数
        deletePrize:{},
	    prizeList: [],
	    prizeColumns: [
        {
          title: '序号',
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '奖品id',
          key: 'prizeId',
          align:'center'
        },
        {
            title:'连续天数',
            key:'dayNumber',
            align:'center'
        },
        {
        	title:'奖品名称',
        	key:'name',
            align:'center'
        },
        {
        	title:'奖品数量',
        	key:'number',
            align:'center'
        },
        {
        	title:'奖品图片',
        	//key:'imgAddress',
          align:'center',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.imgAddress||''
              },
              style: {
                width: '80px'
              }
            })
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
                style: {
                 margin: '5px'
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
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.delete(params.row)
                  }
                }
              }, '删除');
            var varhh3=  h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                     let  pp=JSON.stringify({
                      currentPage:1,//当前页
                      prizeId:params.row.prizeId
                    });
                    this.$router.push('/main/signPrize/'+pp);
                  }
                }
              }, '签到奖品');
            	var s=h("div","");
			s=h("div",[
        h("div",[
              varhh1,
              varhh2
        ]),
        h("div",[
              varhh3
        ]),
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
        accountId:JSON.parse(this.$route.params.pathParams).accountId,
        subscriptionId:JSON.parse(this.$route.params.pathParams).subscriptionId
     })
     //console.log(this.$route.path.substr(0,this.$route.path.indexOf(this.$route.params.pathParams)))
      this.$router.push(this.$route.path.substr(0,this.$route.path.indexOf(this.$route.params.pathParams))+pp);
      this.getList()
    },
     //获取增加的图片
    getAddImgAddress(data){
      this.addPrize.imgAddress=data[0].url
    },
    //获取修改的图片
    getUpdateImgAddress(data){
      this.updatePrize.imgAddress=data[0].url
    },
     //获取增加的编辑器内容
    getAddEditor(data){
      this.addPrize.content=data
    },
    //获取修改的编辑器内容
    getUpdateEditor(data){
      this.updatePrize.content=data
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
     this.params.accountId=JSON.parse(this.$route.params.pathParams).accountId
     this.params.subscriptionId=JSON.parse(this.$route.params.pathParams).subscriptionId
     this.axiosbusiness.getList(this,{
       countUrl:'/prize/count',
       listUrl:'/prize/list',
       data:'prizeList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addPrizeModel = true
      this.addPrize={
          dayNumber:1,
          number:1,
          imgAddress:'',
          content:''
      }
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addPrizeModel = false
        this.$refs.addPrize.resetFields()
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
      ref:'addPrize',
      url:'/prize/add',
      requestObject:'addPrize',
      loading:'addLoading',
      showModel:'addPrizeModel'
    })
    },
	 update (params) {
      this.updatePrizeModel = true
      //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/prize/load?prizeId='+params.prizeId,
         data:'updatePrize',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updatePrizeModel = false
        this.$refs.updatePrize.resetFields()
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
      ref:'updatePrize',
      url:'/prize/update',
      requestObject:'updatePrize',
      loading:'updateLoading',
      showModel:'updatePrizeModel'
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
    this.deletePrize={
      "prizeId":params.prizeId
    };
    this.axiosbusiness.delete(this,{
      url:'/prize/delete',
      requestObject:'deletePrize'
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
                console.log(this.isSuperAdmin)
    
    this.selectPage(JSON.parse(this.$route.params.pathParams).currentPage)
  },
  mounted () {

  }
}
</script>
