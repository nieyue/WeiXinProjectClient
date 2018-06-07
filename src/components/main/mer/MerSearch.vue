<!--商品查询管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
      <Button type='primary'  @click='add'>增加商品查询</Button>
    </div>
		 <!--新增 -->
     <Modal v-model="addMerSearchModel"
           title="新增商品查询管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="addMerSearch" :model="addMerSearch" :label-width="100" label-position="right"  :rules="addMerSearchRules">
        <FormItem prop="name" label="商品搜索名称:">
          <Input type="text" v-model="addMerSearch.name" placeholder="商品搜索名称">
          </Input>
        </FormItem>
        <FormItem prop="number" label="次数:">
          <InputNumber :max="1000000000" :min="0"  :precision='0' v-model="addMerSearch.number"></InputNumber>
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
     <Modal v-model="updateMerSearchModel"
           title="修改商品查询管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="updateMerSearch" :model="updateMerSearch" :label-width="100" label-position="right"  :rules="updateMerSearchRules">
        <FormItem prop="name" label="商品搜索名称:">
          <Input type="text" v-model="updateMerSearch.name" placeholder="商品搜索名称">
          </Input>
        </FormItem>
        <FormItem prop="number" label="次数:">
          <InputNumber :max="1000000000" :min="0"  :precision='0' v-model="updateMerSearch.number"></InputNumber>
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
      <Table border  :columns='merSearchColumns' :data='merSearchList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
    
</template>
<script>
export default {
  name: 'MerSearch',
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
			addMerSearchModel:false,
			addLoading:false,
			addMerSearchRules: {
                name: [
                    {required: true, message: '商品搜索名称为必填项', trigger: 'blur'}
                    ]
                },
			addMerSearch:{
			},
			//修改参数
			updateMerSearchModel:false,
			updateLoading:false,
			updateMerSearchRules: {
                name: [
                    {required: true, message: '商品搜索名称为必填项', trigger: 'blur'}
                    ]
                },
			updateMerSearch:{},
      //删除参数
      deleteMerSearch:{},
	    merSearchList: [],
	    merSearchColumns: [
        {
          title: '序号',
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '商品查询id',
          key: 'merSearchId',
          align:'center'
        },
        {
        	title:'商品搜索名称',
            key:'name',
            align:'center'
        },
        {
        	title:'次数',
            key:'number',
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
       countUrl:'/merSearch/count',
       listUrl:'/merSearch/list',
       data:'merSearchList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addMerSearchModel = true
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addMerSearchModel = false
        this.$refs.addMerSearch.resetFields()
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
      ref:'addMerSearch',
      url:'/merSearch/add',
      requestObject:'addMerSearch',
      loading:'addLoading',
      showModel:'addMerSearchModel'
    })
    },
	 update (params) {
      this.updateMerSearchModel = true
     //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/merSearch/load?merSearchId='+params.merSearchId,
         data:'updateMerSearch',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateMerSearchModel = false
        this.$refs.updateMerSearch.resetFields()
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
      ref:'updateMerSearch',
      url:'/merSearch/update',
      requestObject:'updateMerSearch',
      loading:'updateLoading',
      showModel:'updateMerSearchModel'
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
    this.deleteMerSearch={
      "merSearchId":params.merSearchId
    };
    this.axiosbusiness.delete(this,{
      url:'/merSearch/delete',
      requestObject:'deleteMerSearch'
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
