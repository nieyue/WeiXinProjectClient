<!--商品卡密管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
      <Button type='primary'  @click='add'>增加商品卡密</Button>
    </div>
		 <!--新增 -->
     <Modal v-model="addMerCardCipherModel"
           title="新增商品卡密管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="addMerCardCipher" :model="addMerCardCipher" :label-width="100" label-position="right"  :rules="addMerCardCipherRules">
        <FormItem prop="code" label="卡密码:">
          <Input type="text" v-model="addMerCardCipher.code" placeholder="卡密码">
          </Input>
        </FormItem>
        <FormItem prop="imgAddress" label="图片卡密(上传或者填写):" id="addImgAddressBox">
          <Button type="primary" @click="addImgAddressClick('addImgAddress')" >上传</Button>
          <input type="file" style="width:0px;height:0px;" id="addImgAddress" ref="addImgAddress">
          <div>
            <Input type="text" v-model="addMerCardCipher.imgAddress" placeholder="图片卡密">
          </Input>
             <img :src="addMerCardCipher.imgAddress"  style='width:200px;'alt="">
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
     <Modal v-model="updateMerCardCipherModel"
           title="修改商品卡密管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="updateMerCardCipher" :model="updateMerCardCipher" :label-width="100" label-position="right"  :rules="updateMerCardCipherRules">
        <FormItem prop="code" label="卡密码:">
          <Input type="text" v-model="updateMerCardCipher.code" placeholder="卡密码">
          </Input>
        </FormItem>
        <FormItem prop="imgAddress" label="图片卡密(上传或者填写):" id="updateImgAddressBox">
          <Button type="primary" @click="updateImgAddressClick('updateImgAddress')" >上传</Button>
          <input type="file" style="width:0px;height:0px;" id="updateImgAddress" ref="updateImgAddress">
          <div>
            <Input type="text" v-model="updateMerCardCipher.imgAddress" placeholder="图片卡密">
          </Input>
             <img :src="updateMerCardCipher.imgAddress"  style='width:200px;'alt="">
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
      <Table border  :columns='merCardCipherColumns' :data='merCardCipherList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
    
</template>
<script>
export default {
  name: 'MerCardCipher',
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
			addMerCardCipherModel:false,
			addLoading:false,
			addMerCardCipherRules: {
                },
			addMerCardCipher:{
                imgAddress:''
			},
			//修改参数
			updateMerCardCipherModel:false,
			updateLoading:false,
			updateMerCardCipherRules: {
                },
			updateMerCardCipher:{},
      //删除参数
      deleteMerCardCipher:{},
	    merCardCipherList: [],
	    merCardCipherColumns: [
        {
          title: '序号',
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '商品卡密id',
          key: 'merCardCipherId',
          align:'center'
        },
        {
        	title:'卡密码',
            key:'code',
            align:'center'
        },
          {
        	title:'封面',
            key:'imgAddress',
            width:100,
          align:'center',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.imgAddress
              },
              style: {
                width: '45px'
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
    //增加中的上传图片
     addImgAddressClick(p){
         this.$refs[p].click();
       },
    //更新中的上传图片
     updateImgAddressClick(p){
         this.$refs[p].click();
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
       countUrl:'/merCardCipher/count',
       listUrl:'/merCardCipher/list',
       data:'merCardCipherList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addMerCardCipherModel = true
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addMerCardCipherModel = false
        this.$refs.addMerCardCipher.resetFields()
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
    this.addMerCardCipher.merId=this.$route.params.merId
    this.axiosbusiness.add(this,{
      ref:'addMerCardCipher',
      url:'/merCardCipher/add',
      requestObject:'addMerCardCipher',
      loading:'addLoading',
      showModel:'addMerCardCipherModel'
    })
    },
	 update (params) {
      this.updateMerCardCipherModel = true
     //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/merCardCipher/load?merCardCipherId='+params.merCardCipherId,
         data:'updateMerCardCipher',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateMerCardCipherModel = false
        this.$refs.updateMerCardCipher.resetFields()
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
      ref:'updateMerCardCipher',
      url:'/merCardCipher/update',
      requestObject:'updateMerCardCipher',
      loading:'updateLoading',
      showModel:'updateMerCardCipherModel'
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
    this.deleteMerCardCipher={
      "merCardCipherId":params.merCardCipherId
    };
    this.axiosbusiness.delete(this,{
      url:'/merCardCipher/delete',
      requestObject:'deleteMerCardCipher'
    })
    }
  },
  created () {
    this.getList();
    //增加中的上传图片预加载
    this.utils.getQiniuSimpleUploader(this,{
      browseButton:'addImgAddress',
      dropElement:'addImgAddressBox',
      resource:'addMerCardCipher.imgAddress'
    });
    //修改中的上传图片预加载
    this.utils.getQiniuSimpleUploader(this,{
      browseButton:'updateImgAddress',
      dropElement:'updateImgAddressBox',
      resource:'updateMerCardCipher.imgAddress'
    });
  },
  mounted () {

  }
}
</script>
