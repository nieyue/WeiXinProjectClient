<!--商品类型管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
      <Button type='primary'  @click='add'>增加商品类型</Button>
    </div>
		 <!--新增 -->
     <Modal v-model="addMerCateModel"
           title="新增商品类型管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="addMerCate" :model="addMerCate" :label-width="100" label-position="right"  :rules="addMerCateRules">
        <FormItem prop="name" label="名称:">
          <Input type="text" v-model="addMerCate.name" placeholder="名称">
          </Input>
        </FormItem>
        <FormItem prop="summary" label="简介:">
          <Input type="textarea" v-model="addMerCate.summary" :autosize="{minRows: 2,maxRows: 5}"  placeholder="简介">
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
     <Modal v-model="updateMerCateModel"
           title="修改商品类型管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="updateMerCate" :model="updateMerCate" :label-width="100" label-position="right"  :rules="updateMerCateRules">
        <FormItem prop="name" label="名称:">
          <Input type="text" v-model="updateMerCate.name" placeholder="名称">
          </Input>
        </FormItem>
         <FormItem prop="summary" label="简介:">
          <Input type="textarea" v-model="updateMerCate.summary" :autosize="{minRows: 2,maxRows: 5}"  placeholder="简介">
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
      <Table border  :columns='merCateColumns' :data='merCateList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
    
</template>
<script>
export default {
  name: 'MerCate',
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
			addMerCateModel:false,
			addLoading:false,
			addMerCateRules: {
                name: [
                    {required: true, message: '名称为必填项', trigger: 'blur'}
                    ]
                },
			addMerCate:{
			},
			//修改参数
			updateMerCateModel:false,
			updateLoading:false,
			updateMerCateRules: {
                name: [
                    {required: true, message: '名称为必填项', trigger: 'blur'}
                    ]
                },
			updateMerCate:{},
      //删除参数
      deleteMerCate:{},
	    merCateList: [],
	    merCateColumns: [
        {
          title: '序号',
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '商品类型id',
          key: 'merCateId',
          align:'center'
        },
        {
        	title:'名称',
            key:'name',
            align:'center'
        },
        {
        	title:'简介',
            key:'summary',
            align:'center',
             render: (h, params) => {
                 var summary=params.row.summary==null?'':params.row.summary.length>=20?params.row.summary.substring(0,20)+"...":params.row.summary.substring(0);
              // console.log(summary.toString())
                var varhh1=  h('span',summary);
              return varhh1;  
             }
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
       countUrl:'/merCate/count',
       listUrl:'/merCate/list',
       data:'merCateList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addMerCateModel = true
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addMerCateModel = false
        this.$refs.addMerCate.resetFields()
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
      ref:'addMerCate',
      url:'/merCate/add',
      requestObject:'addMerCate',
      loading:'addLoading',
      showModel:'addMerCateModel'
    })
    },
	 update (params) {
      this.updateMerCateModel = true
     //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/merCate/load?merCateId='+params.merCateId,
         data:'updateMerCate',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateMerCateModel = false
        this.$refs.updateMerCate.resetFields()
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
      ref:'updateMerCate',
      url:'/merCate/update',
      requestObject:'updateMerCate',
      loading:'updateLoading',
      showModel:'updateMerCateModel'
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
    this.deleteMerCate={
      "merCateId":params.merCateId
    };
    this.axiosbusiness.delete(this,{
      url:'/merCate/delete',
      requestObject:'deleteMerCate'
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
