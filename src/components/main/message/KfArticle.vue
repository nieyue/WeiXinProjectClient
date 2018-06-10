<!--客服消息文章管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
      <Button type='primary'  @click='add'>增加客服消息文章</Button>
    <!-- qa -->
    </div>
		 <!--新增 -->
     <Modal v-model="addKfArticleModel"
           title="新增客服消息文章管理"
           :closable="false"
           :mask-closable="false"
             width="1000px"
    >
      <Form ref="addKfArticle" :model="addKfArticle" :label-width="100" label-position="right"  :rules="addKfArticleRules">
        <FormItem prop="title" label="图文消息的标题:">
          <Input type="text" v-model="addKfArticle.title" placeholder="图文消息的标题">
          </Input>
        </FormItem>
        <FormItem prop="description" label="图文消息的描述:">
          <Input type="text" v-model="addKfArticle.description" placeholder="图文消息的描述">
          </Input>
        </FormItem>
        <FormItem prop="url" label="图文消息被点击后跳转的链接:">
          <Input type="text" v-model="addKfArticle.url" placeholder="图文消息被点击后跳转的链接">
          </Input>
        </FormItem>
        <FormItem prop="picurl" label="图文消息的图片链接，支持JPG、PNG格式，较好的效果为大图640*320，小图80*80:" >
         <my-upload :defaultUpload="addKfArticle.picurl" @uploadList="getAddImgAddress"></my-upload> 
          <div>
            <Input type="text" v-model="addKfArticle.picurl" placeholder="url">
          </Input>
             <img :src="addKfArticle.picurl"  style='height:200px;width:300px;'alt="">
          </div>
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
     <Modal v-model="updateKfArticleModel"
           title="修改客服消息文章管理"
           :closable="false"
           :mask-closable="false"
             width="1000px"
    >
      <Form ref="updateKfArticle" :model="updateKfArticle" :label-width="100" label-position="right"  :rules="updateKfArticleRules">
        <FormItem prop="title" label="图文消息的标题:">
          <Input type="text" v-model="updateKfArticle.title" placeholder="图文消息的标题">
          </Input>
        </FormItem>
        <FormItem prop="description" label="图文消息的描述:">
          <Input type="text" v-model="updateKfArticle.description" placeholder="图文消息的描述">
          </Input>
        </FormItem>
        <FormItem prop="url" label="图文消息被点击后跳转的链接:">
          <Input type="text" v-model="updateKfArticle.url" placeholder="图文消息被点击后跳转的链接">
          </Input>
        </FormItem>
        <FormItem prop="picurl" label="图文消息的图片链接，支持JPG、PNG格式，较好的效果为大图640*320，小图80*80:" >
         <my-upload :defaultUpload="updateKfArticle.picurl" @uploadList="getUpdateImgAddress"></my-upload> 
          <div>
            <Input type="text" v-model="updateKfArticle.picurl" placeholder="url">
          </Input>
             <img :src="updateKfArticle.picurl"  style='height:200px;width:300px;'alt="">
          </div>
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
      <Table border :columns='kfArticleColumns' :data='kfArticleList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :current="params.currentPage"  :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
</template>
<script>
export default {
  name: 'KfArticle',
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
			addKfArticleModel:false,
			addLoading:false,
			addKfArticleRules: {
                url: [
                    {type:"url",required: true, message: '必填项', trigger: 'blur'}
                    ],
                },
			addKfArticle:{
			},
			//修改参数
			updateKfArticleModel:false,
			updateLoading:false,
			updateKfArticleRules: {
                url: [
                    {type:"url",required: true, message: '必填项', trigger: 'blur'}
                    ],
                },
			updateKfArticle:{
      },
        //删除参数
        deleteKfArticle:{},
	    kfArticleList: [],
	    kfArticleColumns: [
        {
          title: '序号',
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '客服消息文章id',
          key: 'kfArticleId',
          align:'center'
        },
        {
            title:'图文消息的标题',
            key:'title',
            align:'center'
        },
        {
        	title:'图文消息的描述',
        	key:'description',
            align:'center'
        },
        {
        	title:'图文消息被点击后跳转的链接',
        	key:'url',
            align:'center'
        },
        {
        	title:'图文消息的图片链接，支持JPG、PNG格式，较好的效果为大图640*320，小图80*80',
        	//key:'picurl',
          align:'center',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.picurl||''
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
        kfMessageId:JSON.parse(this.$route.params.pathParams).kfMessageId,
     })
      this.$router.push(this.$route.path.substr(0,this.$route.path.indexOf(this.$route.params.pathParams))+pp);
      this.getList()
    },
     //获取增加的图片
    getAddImgAddress(data){
      this.addKfArticle.picurl=data[0].url
    },
    //获取修改的图片
    getUpdateImgAddress(data){
      this.updateKfArticle.picurl=data[0].url
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
     this.params.kfMessageId=JSON.parse(this.$route.params.pathParams).kfMessageId
     this.axiosbusiness.getList(this,{
       countUrl:'/kfArticle/count',
       listUrl:'/kfArticle/list',
       data:'kfArticleList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addKfArticleModel = true
      this.addKfArticle={
          picurl:'',
      }
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addKfArticleModel = false
        this.$refs.addKfArticle.resetFields()
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
    this.addKfArticle.kfMessageId=JSON.parse(this.$route.params.pathParams).kfMessageId
    this.axiosbusiness.add(this,{
      ref:'addKfArticle',
      url:'/kfArticle/add',
      requestObject:'addKfArticle',
      loading:'addLoading',
      showModel:'addKfArticleModel'
    })
    },
	 update (params) {
      this.updateKfArticleModel = true
      //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/kfArticle/load?kfArticleId='+params.kfArticleId,
         data:'updateKfArticle',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateKfArticleModel = false
        this.$refs.updateKfArticle.resetFields()
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
      ref:'updateKfArticle',
      url:'/kfArticle/update',
      requestObject:'updateKfArticle',
      loading:'updateLoading',
      showModel:'updateKfArticleModel'
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
    this.deleteKfArticle={
      "kfArticleId":params.kfArticleId
    };
    this.axiosbusiness.delete(this,{
      url:'/kfArticle/delete',
      requestObject:'deleteKfArticle'
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
