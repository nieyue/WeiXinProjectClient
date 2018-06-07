<!--商品公用管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
      <!-- <Button type='primary'  @click='add'>增加商品公用</Button> -->
      <Button type='primary'  @click='update(updateMerCommon)'>修改商品公用</Button>
    </div>
		 <!--新增 -->
     <Modal v-model="addMerCommonModel"
           title="新增商品公用管理"
           :closable="false"
           :mask-closable="false"
           width="1000px"
    >
      <Form ref="addMerCommon" :model="addMerCommon" :label-width="100" label-position="right"  :rules="addMerCommonRules">
        <FormItem prop="guide" label="购物指南:">
          <div id="addMerCommonGuideEditor" style="text-align:left"></div>
        </FormItem>
        <FormItem prop="guarantee" label="售后保障:">
          <div id="addMerCommonGuaranteeEditor" style="text-align:left"></div>
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
     <Modal v-model="updateMerCommonModel"
           title="修改商品公用管理"
           :closable="false"
           :mask-closable="false"
           width="1000px"
    >
      <Form ref="updateMerCommon" :model="updateMerCommon" :label-width="100" label-position="right"  :rules="updateMerCommonRules">
        <FormItem prop="guide" label="购物指南:">
          <div id="updateMerCommonGuideEditor" style="text-align:left"></div>
        </FormItem>
        <FormItem prop="guarantee" label="售后保障:">
          <div id="updateMerCommonGuaranteeEditor" style="text-align:left"></div>
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

     <Card v-if="!updateMerCommon">暂无</Card>
      <Card v-if="updateMerCommon" :bordered="true">
            <p slot="title">商品公用</p>
            <p>
              <div style="font-size:24px;color:red;">购物指南：</div>
              <div v-html="updateMerCommon.guide"></div>
            </p>
            <p>
              <div style="font-size:24px;color:red;">售后保障：</div>
              <div v-html="updateMerCommon.guarantee"></div>
            </p>
      </Card>
      <!-- <Table border  :columns='merCommonColumns' :data='merCommonList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div> -->
    </div>
    
</template>
<script>
export default {
  guide: 'MerCommon',
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
			addMerCommonModel:false,
			addLoading:false,
			addMerCommonRules: {
                guide: [
                    {required: true, message: '购物指南为必填项', trigger: 'blur'}
                    ]
                },
			addMerCommon:{
			},
			//修改参数
			updateMerCommonModel:false,
			updateLoading:false,
			updateMerCommonRules: {
                guide: [
                    {required: true, message: '购物指南为必填项', trigger: 'blur'}
                    ]
                },
			updateMerCommon:{},
      //删除参数
      deleteMerCommon:{},
	    merCommonList: [],
	    merCommonColumns: [
        {
          title: '序号',
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '商品公用id',
          key: 'merCommonId',
          align:'center'
        },
        {
        	title:'购物指南',
            key:'guide',
            align:'center'
        },
        {
        	title:'售后保障',
            key:'guarantee',
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
			s=h("div",[
              varhh1
              ,varhh2
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
     this.axiosbusiness.getList(this,{
       countUrl:'/merCommon/count',
       listUrl:'/merCommon/list',
       data:'merCommonList',
       success:()=>{
           this.updateMerCommon=this.merCommonList[0];
       }
     },this.params)
    },
  //增加
	 add (params) {
      this.addMerCommonModel = true
      let Editor=this.wangeditor;
  let addMerCommonGuideEditor=new Editor("#addMerCommonGuideEditor")
  addMerCommonGuideEditor.customConfig.zIndex = 100
  addMerCommonGuideEditor.customConfig.onchange = (html) =>{
    this.addMerCommon.guide=html;
    }
    addMerCommonGuideEditor.create();
    addMerCommonGuideEditor.txt.html('<p>输入内容...😆</p>')
  //wangeditor七牛云上传图片预加载
  this.utils.getQiniuSimpleUploader(this,{
    browseButton:addMerCommonGuideEditor.imgMenuId,
    container:addMerCommonGuideEditor.toolbarElemId,
    dropElement:addMerCommonGuideEditor.textElemId,
    success:(sourceLink)=>{
      addMerCommonGuideEditor.cmd.do('insertHtml', '<img src="' + sourceLink + '" style="max-width:100%;"/>')
   
   }
  });

  let addMerCommonGuaranteeEditor=new Editor("#addMerCommonGuaranteeEditor")
  addMerCommonGuaranteeEditor.customConfig.zIndex = 100
  addMerCommonGuaranteeEditor.customConfig.onchange = (html) =>{
    this.addMerCommon.guarantee=html;
    }
    addMerCommonGuaranteeEditor.create();
    addMerCommonGuaranteeEditor.txt.html('<p>输入内容...😆</p>')
  //wangeditor七牛云上传图片预加载
  this.utils.getQiniuSimpleUploader(this,{
    browseButton:addMerCommonGuaranteeEditor.imgMenuId,
    container:addMerCommonGuaranteeEditor.toolbarElemId,
    dropElement:addMerCommonGuaranteeEditor.textElemId,
    success:(sourceLink)=>{
      addMerCommonGuaranteeEditor.cmd.do('insertHtml', '<img src="' + sourceLink + '" style="max-width:100%;"/>')
   
   }
  });
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addMerCommonModel = false
        this.$refs.addMerCommon.resetFields()
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
      ref:'addMerCommon',
      url:'/merCommon/add',
      requestObject:'addMerCommon',
      loading:'addLoading',
      showModel:'addMerCommonModel'
    })
    },
	 update (params) {
      this.updateMerCommonModel = true
     //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/merCommon/load?merCommonId='+params.merCommonId,
         data:'updateMerCommon',
           success:()=>{
           let Editor=this.wangeditor;
           let updateMerCommonGuideEditor=new Editor("#updateMerCommonGuideEditor")
           updateMerCommonGuideEditor.customConfig.zIndex = 100
           updateMerCommonGuideEditor.customConfig.onchange = (html)=> {
             this.updateMerCommon.guide=html;
             }
             updateMerCommonGuideEditor.customConfig.qiniu = true//允许上传七牛
           updateMerCommonGuideEditor.create();
           updateMerCommonGuideEditor.txt.html(this.updateMerCommon.guide)
           //wangeditor七牛云上传图片预加载
          this.utils.getQiniuSimpleUploader(this,{
            browseButton:updateMerCommonGuideEditor.imgMenuId,
            container:updateMerCommonGuideEditor.toolbarElemId,
            dropElement:updateMerCommonGuideEditor.textElemId,
            success:(sourceLink)=>{
              updateMerCommonGuideEditor.cmd.do('insertHtml', '<img src="' + sourceLink + '" style="max-width:100%;"/>')
            }
          });

           let updateMerCommonGuaranteeEditor=new Editor("#updateMerCommonGuaranteeEditor")
           updateMerCommonGuaranteeEditor.customConfig.zIndex = 100
           updateMerCommonGuaranteeEditor.customConfig.onchange = (html)=> {
             this.updateMerCommon.guarantee=html;
             }
             updateMerCommonGuaranteeEditor.customConfig.qiniu = true//允许上传七牛
           updateMerCommonGuaranteeEditor.create();
           updateMerCommonGuaranteeEditor.txt.html(this.updateMerCommon.guarantee)
           //wangeditor七牛云上传图片预加载
          this.utils.getQiniuSimpleUploader(this,{
            browseButton:updateMerCommonGuaranteeEditor.imgMenuId,
            container:updateMerCommonGuaranteeEditor.toolbarElemId,
            dropElement:updateMerCommonGuaranteeEditor.textElemId,
            success:(sourceLink)=>{
              updateMerCommonGuaranteeEditor.cmd.do('insertHtml', '<img src="' + sourceLink + '" style="max-width:100%;"/>')
            }
          });

         }
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateMerCommonModel = false
        //this.$refs.updateMerCommon.resetFields()
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
      ref:'updateMerCommon',
      url:'/merCommon/update',
      requestObject:'updateMerCommon',
      loading:'updateLoading',
      showModel:'updateMerCommonModel'
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
    this.deleteMerCommon={
      "merCommonId":params.merCommonId
    };
    this.axiosbusiness.delete(this,{
      url:'/merCommon/delete',
      requestObject:'deleteMerCommon'
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
