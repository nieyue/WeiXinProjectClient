<!--收货地址管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
    <!-- qa -->
    </div>
		 <!--修改 -->
     <Modal v-model="updateReceiptInfoModel"
           title="修改收货地址管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="updateReceiptInfo" :model="updateReceiptInfo" :label-width="100" label-position="right"  :rules="updateReceiptInfoRules">
        <FormItem prop="name" label="姓名:">
          <Input type="text" v-model="updateReceiptInfo.name" placeholder="姓名">
          </Input>
        </FormItem>
        <FormItem prop="phone" label="手机号:">
          <Input type="text" v-model="updateReceiptInfo.phone" placeholder="手机号">
          </Input>
        </FormItem>
        <FormItem prop="updateProvinceCityArea" label="省/市/区:">
	          <Cascader :data="threeCityData"  @on-change="updateProvinceAndCityAndArea" v-model="updateProvinceCityArea" trigger="hover"></Cascader>
	    </FormItem>
        <FormItem prop="address" class="form-item"  label="收货地址:">
	          <Input type="text" v-model="updateReceiptInfo.address" placeholder="收货地址">
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
      <Table border :columns='receiptInfoColumns' :data='receiptInfoList' ref='table' size="small"></Table>
      <!-- <br/>
      <Button type="primary" size="large" @click="exportData"><Icon type="ios-download-outline"></Icon>导出数据</Button> -->
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :current="params.currentPage"  :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
</template>
<script>
import threeCity from "@/components/service/threecitylist"
export default {
  name: 'ReceiptInfo',
  data () {
    return {
    //三级联动数据
      threeCityData:threeCity.getThreeCity(),
      //更新的接受省、市、区
      updateProvinceCityArea:[],
        params:{
            startNum:1,//初始化个数
            currentPage:1,//当前页
            pageNum:1,//获取的第几个开始
            pageSize:10,//每页的个数
            total:0//总数
        },
        //修改参数
        updateReceiptInfoModel:false,
        updateLoading:false,
        updateReceiptInfoRules: {
            name: [
                {required: true, message: '名称为必填项', trigger: 'blur'}
                ],
            },
        updateReceiptInfo:{
    },
        //删除参数
        deleteReceiptInfo:{},
	    receiptInfoList: [],
	    receiptInfoColumns: [
        {
          title: '序号',
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '收货地址id',
          key: 'receiptInfoId',
          align:'center'
        },
        {
            title:'姓名',
            key:'name',
            align:'center'
        },
        {
            title:'手机号',
            key:'phone',
            align:'center'
        },
        {
            title:'省市区',
            align:'center',
            render:(h,params)=>{
                
                var r=params.row.province+params.row.city+params.row.area
                return h("div",r)
            }
        },
        {
        	title:'收货地址',
        	key:'address',
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
              let hh12=h("div","");
              if(this.isSuperAdmin){

                  hh12=h("div",[
                      varhh1,
                      varhh2
                  ]);
              }
            return hh12;
        }
        }
      ],
    }
  },
  methods: {
       //更新中的二级联动省和市
	updateProvinceAndCityAndArea(value,label){
        this.updateReceiptInfo.province=label[0].label
        this.updateReceiptInfo.city=label[1].label
        this.updateReceiptInfo.area=label[2].label
    },
    //分页点击
    selectPage (currentPage) {
      this.params.currentPage=currentPage;
      this.params.pageNum = (this.params.currentPage-1)*this.params.pageSize+this.params.startNum;
      //构造path
     let pp=JSON.stringify({
       currentPage:currentPage,
        openid:JSON.parse(this.$route.params.pathParams).openid,
        accountId:JSON.parse(this.$route.params.pathParams).accountId
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
     this.params.openid=JSON.parse(this.$route.params.pathParams).openid
     this.params.accountId=JSON.parse(this.$route.params.pathParams).accountId
     this.axiosbusiness.getList(this,{
       countUrl:'/receiptInfo/count',
       listUrl:'/receiptInfo/list',
       data:'receiptInfoList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addReceiptInfoModel = true
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addReceiptInfoModel = false
        this.$refs.addReceiptInfo.resetFields()
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
      ref:'addReceiptInfo',
      url:'/receiptInfo/add',
      requestObject:'addReceiptInfo',
      loading:'addLoading',
      showModel:'addReceiptInfoModel'
    })
    },
	 update (params) {
      this.updateReceiptInfoModel = true
      //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/receiptInfo/load?receiptInfoId='+params.receiptInfoId,
         data:'updateReceiptInfo',
         success:()=>{
             let province=this.updateReceiptInfo.province
             let city=this.updateReceiptInfo.city
             let area=this.updateReceiptInfo.area
            this.updateProvinceCityArea=threeCity.getValueByLabel(province,city,area)

         }
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateReceiptInfoModel = false
        this.$refs.updateReceiptInfo.resetFields()
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
      ref:'updateReceiptInfo',
      url:'/receiptInfo/update',
      requestObject:'updateReceiptInfo',
      loading:'updateLoading',
      showModel:'updateReceiptInfoModel'
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
    this.deleteReceiptInfo={
      "receiptInfoId":params.receiptInfoId
    };
    this.axiosbusiness.delete(this,{
      url:'/receiptInfo/delete',
      requestObject:'deleteReceiptInfo'
    })
    },
    //导出数据
   /*  exportData (type) {
      this.$refs.table.exportCsv({
          filename: '收货地址',
          columns: this.ReceiptInfoCoumns,
          data: this.ReceiptInfoList
      });
    }       */
  },
   watch: {
    //当前页面参数修改动态启动
      $route (to,from){
        this.selectPage(JSON.parse(this.$route.params.pathParams).currentPage)
      }
    }, 
  created () {
       //判断是否超级管理员
    this.isSuperAdmin=this.business.getIsSuperAdmin()
    this.selectPage(JSON.parse(this.$route.params.pathParams).currentPage)
  },
  mounted () {

  }
}
</script>
