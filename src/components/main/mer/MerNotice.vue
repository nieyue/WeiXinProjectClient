<!--商品公告管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
      <Button type='primary'  @click='add'>增加商品公告</Button>
    </div>
		 <!--新增 -->
     <Modal v-model="addMerNoticeModel"
           title="新增商品公告管理"
           :closable="false"
           :mask-closable="false"
           width="1000px"
    >
      <Form ref="addMerNotice" :model="addMerNotice" :label-width="100"  label-position="right"  :rules="addMerNoticeRules">
        <FormItem prop="title" label="标题:">
          <Input type="text" v-model="addMerNotice.title" placeholder="标题">
          </Input>
        </FormItem>
        <FormItem prop="content" label="内容:">
          <div id="addMerNoticeContentEditor" style="text-align:left"></div>
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
     <Modal v-model="updateMerNoticeModel"
           title="修改商品公告管理"
           :closable="false"
           :mask-closable="false"
           width="1000px"
    >
      <Form ref="updateMerNotice" :model="updateMerNotice" :label-width="100" label-position="right"  :rules="updateMerNoticeRules">
         <FormItem prop="title" label="标题:">
          <Input type="text" v-model="updateMerNotice.title" placeholder="标题">
          </Input>
        </FormItem>
        <FormItem prop="content" label="内容:">
          <div id="updateMerNoticeContentEditor" style="text-align:left"></div>
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
      <Table border :columns='merNoticeColumns' :data='merNoticeList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'  @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
</template>
<script>
export default {
  name: 'MerNotice',
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
			addMerNoticeModel:false,
			addLoading:false,
			addMerNoticeRules: {
                title: [
                    {required: true, message: '标题为必填项', trigger: 'blur'}
                    ]
                },
			addMerNotice:{},
			//修改参数
			updateMerNoticeModel:false,
			updateLoading:false,
			updateMerNoticeRules: {
                title: [
                    {required: true, message: '标题为必填项', trigger: 'blur'}
                    ]
                },
			updateMerNotice:{},
      //删除参数
      deleteMerNotice:{},
      //列表
        merNoticeList: [],
	    merNoticeColumns: [
        {
          title: '序号',
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '商品公告id',
          key: 'merNoticeId',
          align:'center'
        },
        {
        	title:'标题',
            key:'title',
          align:'center'
        },
        {
        title:'创建时间',
        key:'createDate',
        sortable: true,
        align:'center'
        },
		{
        title: '操作',
        key: 'action',
        align:'center',
          render: (h, params) => {
            var marginstyle="2px"
              
            var varhh20=  h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  margin: marginstyle
                },
                on: {
                  click: () => {
                    this.update(params.row)
                  }
                }
              }, '编辑');
            var varhh21=  h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  margin: marginstyle
                },
                on: {
                  click: () => {
                    this.delete(params.row)
                  }
                }
              }, '删除');
            	var s=h("div","");
			s=h("div",[
        h("div",[
           varhh20
          ,varhh21
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
     this.params.merId=this.$route.params.merId
     this.axiosbusiness.getList(this,{
       countUrl:'/merNotice/count',
       listUrl:'/merNotice/list',
       data:'merNoticeList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addMerNoticeModel = true
         let Editor=this.wangeditor;
  let addMerNoticeContentEditor=new Editor("#addMerNoticeContentEditor")
  addMerNoticeContentEditor.customConfig.zIndex = 100
  addMerNoticeContentEditor.customConfig.onchange = (html) =>{
    this.addMerNotice.content=html;
    }
    addMerNoticeContentEditor.create();
    addMerNoticeContentEditor.txt.html('<p>输入内容...</p>')
  //wangeditor七牛云上传图片预加载
  this.utils.getQiniuSimpleUploader(this,{
    browseButton:addMerNoticeContentEditor.imgMenuId,
    container:addMerNoticeContentEditor.toolbarElemId,
    dropElement:addMerNoticeContentEditor.textElemId,
    success:(sourceLink)=>{
      addMerNoticeContentEditor.cmd.do('insertHtml', '<img src="' + sourceLink + '" style="max-width:100%;"/>')
   
   }
  });
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addMerNoticeModel = false
        this.$refs.addMerNotice.resetFields()
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
    this.addMerNotice.merId=this.$route.params.merId
    this.axiosbusiness.add(this,{
      ref:'addMerNotice',
      url:'/merNotice/add',
      requestObject:'addMerNotice',
      loading:'addLoading',
      showModel:'addMerNoticeModel'
    })
    },
	 update (params) {
      this.updateMerNoticeModel = true
      this.updateMerNotice.merNoticeId = params.merNoticeId
     //获取修改实体
      this.axiosbusiness.get(this,{
          url:'/merNotice/load?merNoticeId='+params.merNoticeId,
         data:'updateMerNotice',
         success:()=>{
              let Editor=this.wangeditor;
           let updateMerNoticeContentEditor=new Editor("#updateMerNoticeContentEditor")
           updateMerNoticeContentEditor.customConfig.zIndex = 100
           updateMerNoticeContentEditor.customConfig.onchange = (html)=> {
             this.updateMerNotice.content=html;
             }
             updateMerNoticeContentEditor.customConfig.qiniu = true//允许上传七牛
           updateMerNoticeContentEditor.create();
           updateMerNoticeContentEditor.txt.html(this.updateMerNotice.content)
           //wangeditor七牛云上传图片预加载
          this.utils.getQiniuSimpleUploader(this,{
            browseButton:updateMerNoticeContentEditor.imgMenuId,
            container:updateMerNoticeContentEditor.toolbarElemId,
            dropElement:updateMerNoticeContentEditor.textElemId,
            success:(sourceLink)=>{
              updateMerNoticeContentEditor.cmd.do('insertHtml', '<img src="' + sourceLink + '" style="max-width:100%;"/>')
            }
          });
         }
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateMerNoticeModel = false
        this.$refs.updateMerNotice.resetFields()
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
      ref:'updateMerNotice',
      url:'/merNotice/update',
      requestObject:'updateMerNotice',
      loading:'updateLoading',
      showModel:'updateMerNoticeModel'
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
    this.deleteMerNotice={
      "merNoticeId":params.merNoticeId
    };
    this.axiosbusiness.delete(this,{
      url:'/merNotice/delete',
      requestObject:'deleteMerNotice'
    })
    }
  },
  created () {
    this.getList();
  },
  mounted () {

  }
}
</script>
