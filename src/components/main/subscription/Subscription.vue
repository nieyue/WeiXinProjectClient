<!--公众号管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
      <Button type='primary'  @click='add'>增加公众号</Button>
    </div>
		 <!--新增 -->
     <Modal v-model="addSubscriptionModel"
           title="新增公众号管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="addSubscription" :model="addSubscription" :label-width="100" label-position="right"  :rules="addSubscriptionRules">
        <FormItem prop="name" label="公众号名:">
          <Input type="text" v-model="addSubscription.name" placeholder="公众号名">
          </Input>
        </FormItem>
        <FormItem prop="appid" label="公众号应用id:">
          <Input type="text" v-model="addSubscription.appid" placeholder="公众号应用id">
          </Input>
        </FormItem>
        <FormItem prop="appsecret" label="公众号秘钥:">
          <Input type="text" v-model="addSubscription.appsecret" placeholder="公众号秘钥">
          </Input>
        </FormItem>
        <FormItem prop="ghid" label="公众号原始id:">
          <Input type="text" v-model="addSubscription.ghid" placeholder="公众号原始id">
          </Input>
        </FormItem>
        <FormItem prop="imgAddress" label="公众号二维码(上传或者填写):" id="addImgAddressBox">
          <my-upload v-bind:defaultUpload="addSubscription.imgAddress" v-on:uploadList="getAddImgAddress"></my-upload> 
          <div>
            <Input type="text" v-model="addSubscription.imgAddress" placeholder="公众号二维码">
            </Input>
             <img :src="addSubscription.imgAddress"  style='height:200px;width:300px;'alt="">
          </div>
        </FormItem>
          
        <FormItem prop="mchid" label="公众号商户id:">
          <Input type="text" v-model="addSubscription.mchid" placeholder="公众号商户id">
          </Input>
        </FormItem>
        <FormItem prop="mchkey" label="公众号商户秘钥key:">
          <Input type="text" v-model="addSubscription.mchkey" placeholder="公众号商户秘钥key">
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
     <Modal v-model="updateSubscriptionModel"
           title="修改公众号管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="updateSubscription" :model="updateSubscription" :label-width="100" label-position="right"  :rules="updateSubscriptionRules">
          <FormItem prop="name" label="公众号名:">
          <Input type="text" v-model="updateSubscription.name" placeholder="公众号名">
          </Input>
        </FormItem>
        <FormItem prop="appid" label="公众号应用id:">
          <Input type="text" v-model="updateSubscription.appid" placeholder="公众号应用id">
          </Input>
        </FormItem>
        <FormItem prop="appsecret" label="公众号秘钥:">
          <Input type="text" v-model="updateSubscription.appsecret" placeholder="公众号秘钥">
          </Input>
        </FormItem>
        <FormItem prop="ghid" label="公众号原始id:">
          <Input type="text" v-model="updateSubscription.ghid" placeholder="公众号原始id">
          </Input>
        </FormItem>
        <FormItem prop="imgAddress" label="公众号二维码(上传或者填写):" id="updateImgAddressBox">
           <my-upload v-bind:defaultUpload="updateSubscription.imgAddress" v-on:uploadList="getUpdateImgAddress"></my-upload> 
          <div>
            <Input type="text" v-model="updateSubscription.imgAddress" placeholder="公众号二维码">
            </Input>
             <img :src="updateSubscription.imgAddress"  style='height:200px;width:300px;'alt="">
          </div>
        </FormItem>
        <FormItem prop="mchid" label="公众号商户id:">
          <Input type="text" v-model="updateSubscription.mchid" placeholder="公众号商户id">
          </Input>
        </FormItem>
        <FormItem prop="mchkey" label="公众号商户秘钥key:">
          <Input type="text" v-model="updateSubscription.mchkey" placeholder="公众号商户秘钥key">
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
      <Table border :columns='subscriptionColumns' :data='subscriptionList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :current="params.currentPage" :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
</template>
<script>

export default {
  name: 'Subscription',
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
			addSubscriptionModel:false,
			addLoading:false,
			addSubscriptionRules: {
                name: [
                    {required: true, message: '内容为必填项', trigger: 'blur'}
                    ]
                },
			addSubscription:{
			},
			//修改参数
			updateSubscriptionModel:false,
			updateLoading:false,
			updateSubscriptionRules: {
                name: [
                    {required: true, message: '内容为必填项', trigger: 'blur'}
                    ]
                },
			updateSubscription:{
      },
      //删除参数
      deleteSubscription:{},
	    subscriptionList:[],
	    subscriptionColumns: [
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
          title: '公众号id',
          key: 'subscriptionId',
          align:'center'
        },
        {
        	title:'公众号名',
        	key:'name',
          align:'center'
        },
        {
        	title:'公众号应用id',
        	key:'appid',
          align:'center'
        },
        {
        	title:'公众号秘钥',
        	key:'appsecret',
          align:'center'
        },
        {
        	title:'公众号原始id',
        	key:'ghid',
          align:'center'
        },
        {
        	title:'公众号二维码',
        	//key:'imgAddress',
          align:'center',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.imgAddress||''
              },
              style: {
                width: '45px'
              }
            })
          }
        },
        {
        	title:'公众号商户id',
        	key:'mchid',
          align:'center'
        },
        {
        	title:'公众号商户秘钥key',
        	key:'mchkey',
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
            var varhh3=  h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                on: {
                  click: () => {
                     let  pp=JSON.stringify({
                      currentPage:1,//当前页
                      subscriptionId:params.row.subscriptionId
                    });
                    this.$router.push('/main/kfMessage/'+pp);
                  }
                }
              }, '客服消息');
            	var s=h("div","");
              s=h("div",[
                h("div",[
                  varhh3
                ]),
                h("div",[
                      varhh1,
                      varhh2
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
       accountId:JSON.parse(this.$route.params.pathParams).accountId
     })
     //console.log(this.$route.path.substr(0,this.$route.path.indexOf(this.$route.params.pathParams)))
      this.$router.push(this.$route.path.substr(0,this.$route.path.indexOf(this.$route.params.pathParams))+pp);
      this.getList()
    },
    //获取增加的图片
    getAddImgAddress(data){
      this.addSubscription.imgAddress=data[0].url
    },
    //获取修改的图片
    getUpdateImgAddress(data){
      this.updateSubscription.imgAddress=data[0].url
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
     this.axiosbusiness.getList(this,{
       countUrl:'/subscription/count',
       listUrl:'/subscription/list',
       data:'subscriptionList',
       success:(a)=>{
         console.log(a)
       }
     },this.params)
    },
  //增加
	 add (params) {
      this.addSubscriptionModel = true
      this.addSubscription={
           accountId:JSON.parse(this.$route.params.pathParams).accountId,
           imgAddress:''
			}
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addSubscriptionModel = false
        this.$refs.addSubscription.resetFields()
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
      ref:'addSubscription',
      url:'/subscription/add',
      requestObject:'addSubscription',
      loading:'addLoading',
      showModel:'addSubscriptionModel'
    })
    },
	 update (params) {
      this.updateSubscriptionModel = true
      //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/subscription/load?subscriptionId='+params.subscriptionId,
         data:'updateSubscription',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateSubscriptionModel = false
        this.$refs.updateSubscription.resetFields()
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
      ref:'updateSubscription',
      url:'/subscription/update',
      requestObject:'updateSubscription',
      loading:'updateLoading',
      showModel:'updateSubscriptionModel'
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
    this.deleteSubscription={
      "subscriptionId":params.subscriptionId
    };
    this.axiosbusiness.delete(this,{
      url:'/subscription/delete',
      requestObject:'deleteSubscription'
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
    //this.getList();
    
  },
  mounted () {

  }
}
</script>
