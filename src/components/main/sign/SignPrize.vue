<!--签到奖品管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
    <!-- qa -->
    </div>
		 <!--修改 -->
     <Modal v-model="updateSignPrizeModel"
           title="修改签到奖品管理"
           :closable="false"
           :mask-closable="false"
             width="1000px"
    >
      <Form ref="updateSignPrize" :model="updateSignPrize" :label-width="100" label-position="right"  :rules="updateSignPrizeRules">
       <FormItem prop="dayNumber" label="连续天数:">
            <InputNumber :max="1000000000" :min="1"  :precision='0'  v-model="updateSignPrize.dayNumber"></InputNumber>
        </FormItem>
        <FormItem prop="name" label="签到奖品名:">
          <Input type="text" v-model="updateSignPrize.name" placeholder="签到奖品名">
          </Input>
        </FormItem>
        <FormItem prop="number" label="签到奖品数量:">
            <InputNumber :max="1000000000" :min="1" :precision='0'  v-model="updateSignPrize.number"></InputNumber>
        </FormItem>
        <FormItem prop="imgAddress" label="签到奖品图片(上传或者填写):" id="updateImgAddressBox">
          <my-upload :defaultUpload="updateSignPrize.imgAddress" @uploadList="getUpdateImgAddress"></my-upload> 
          <div>
            <Input type="text" v-model="updateSignPrize.imgAddress" placeholder="url">
          </Input>
             <img :src="updateSignPrize.imgAddress"  style='height:200px;width:300px;'alt="">
          </div>
        </FormItem>
        <FormItem prop="content" label="签到奖品内容:">
          <my-wangeditor :content="updateSignPrize.content" @getWangEditorContent="getUpdateEditor"></my-wangeditor>
        </FormItem>
          <FormItem prop="status" label="状态:">
          <Select v-model="updateSignPrize.status" transfer size="large" style="width:100px">
              <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.value }}</Option>
          </Select>
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
      <Table border :columns='signPrizeColumns' :data='signPrizeList' ref='table' size="small"></Table>
      <!-- <br/>
      <Button type="primary" size="large" @click="exportData"><Icon type="ios-download-outline"></Icon>导出数据</Button> -->
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :current="params.currentPage"  :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
</template>
<script>
export default {
  name: 'SignPrize',
  data () {
    return {
        params:{
            startNum:1,//初始化个数
            currentPage:1,//当前页
            pageNum:1,//获取的第几个开始
            pageSize:10,//每页的个数
            total:0//总数
        },
        //状态
        statusList:[
            {id:1,value:'待申请'},
            {id:2,value:'申请领奖'},
            {id:3,value:'领取成功'},
            {id:4,value:'拒绝发送'}
        ],
			//修改参数
			updateSignPrizeModel:false,
			updateLoading:false,
			updateSignPrizeRules: {
                name: [
                    {required: true, message: '签到奖品名为必填项', trigger: 'blur'}
                    ],
                },
			updateSignPrize:{
      },
        //删除参数
        deleteSignPrize:{},
	    signPrizeList: [],
	    signPrizeColumns: [
        {
          title: '序号',
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '签到奖品id',
          key: 'signPrizeId',
          align:'center'
        },
        {
            title:'公众号id',
            key:'subscriptionId',
            align:'center'
        },
        {
            title:'openid',
            key:'openid',
            align:'center',
            render:(h,params)=>{
              var r=h("div",params.row.openid);
              //如果已经申请才显示
                r=h("div",[
                  h("div",params.row.openid),
                   h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        margin: '5px'
                      },
                      on: {
                        click: () => {
                          let  pp=JSON.stringify({
                            currentPage:1,//当前页
                            openid:params.row.openid
                          });
                           this.$router.push('/main/receiptInfo/'+pp);
                        }
                      }
                    }, '收货地址')
                ]);
              return r;
            }
        },
        {
            title:'连续天数',
            key:'dayNumber',
            align:'center'
        },
        {
        	title:'签到奖品名称',
        	key:'name',
          align:'center'
        },
        {
        	title:'签到奖品数量',
        	key:'number',
          align:'center'
        },
        {
        	title:'签到奖品图片',
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
          title:'领奖时间',
          key:'prizeDate',
          sortable: true,
          align:'center'
        },
         {
        	title:'状态',
          key:'status',
          align:'center',
          render: (h, params) => {
            let statusvalue="";
            this.statusList.forEach(element => {
              if(element.id==params.row.status){
                statusvalue=element.value;
              }
            });
             return  h('span',statusvalue);
          }
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
                  type: 'success',
                  size: 'small'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.statusOk(params.row)
                  }
                }
              }, '领取成功');
            var varhh4=  h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.statusFail(params.row)
                  }
                }
              }, '拒绝发送');
                var s=h("div","");
                var varhharray=[];
                let hh12=h("div",[
                      varhh1,
                      varhh2
                  ]);
                let hh34=h("div",[
                      varhh3,
                      varhh4
                  ]);
        if(this.isSuperAdmin){
            varhharray=[
                hh12
            ];
            //如果用户已经申请
            if(params.row.status==2){
        varhharray=[
                hh12,
                hh34
            ];
            }
          }else{
              varhharray=[
            ];
               //如果用户已经申请
            if(params.row.status==2){
        varhharray=[
                hh34
            ];
            }
              }
        s=h("div",varhharray);
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
        prizeId:JSON.parse(this.$route.params.pathParams).prizeId,
        subscriptionId:JSON.parse(this.$route.params.pathParams).subscriptionId
     })
     //console.log(this.$route.path.substr(0,this.$route.path.indexOf(this.$route.params.pathParams)))
      this.$router.push(this.$route.path.substr(0,this.$route.path.indexOf(this.$route.params.pathParams))+pp);
      this.getList()
    },
    //获取修改的图片
    getUpdateImgAddress(data){
      this.updateSignPrize.imgAddress=data[0].url
    },
    //获取修改的编辑器内容
    getUpdateEditor(data){
      this.updateSignPrize.content=data
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
     this.params.prizeId=JSON.parse(this.$route.params.pathParams).prizeId
     this.params.subscriptionId=JSON.parse(this.$route.params.pathParams).subscriptionId
     this.axiosbusiness.getList(this,{
       countUrl:'/signPrize/count',
       listUrl:'/signPrize/list',
       data:'signPrizeList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addSignPrizeModel = true
      this.addSignPrize={
          dayNumber:1,
          number:1,
          imgAddress:'',
          content:''
      }
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addSignPrizeModel = false
        this.$refs.addSignPrize.resetFields()
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
      ref:'addSignPrize',
      url:'/signPrize/add',
      requestObject:'addSignPrize',
      loading:'addLoading',
      showModel:'addSignPrizeModel'
    })
    },
	 update (params) {
      this.updateSignPrizeModel = true
      //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/signPrize/load?signPrizeId='+params.signPrizeId,
         data:'updateSignPrize',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateSignPrizeModel = false
        this.$refs.updateSignPrize.resetFields()
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
    delete this.updateSignPrize.account
    delete this.updateSignPrize.subscription
    this.axiosbusiness.update(this,{
      ref:'updateSignPrize',
      url:'/signPrize/update',
      requestObject:'updateSignPrize',
      loading:'updateLoading',
      showModel:'updateSignPrizeModel'
    })
 
    },
    //领取成功
    statusOk (params) {
      /**
     * 修改
     * $this  vue组件
     * p.ref 验证
     * p.url 修改url
     * p.requestObject 请求参数对象
     * p.loading loading
     * p.showModel 界面模型显示隐藏
     */
    delete params.account
    delete params.subscription
    this.updateSignPrize=params
    this.updateSignPrize.status=3
    this.axiosbusiness.update(this,{
      url:'/signPrize/update',
      requestObject:'updateSignPrize',
      loading:'updateLoading',
    })
 
    },
    //拒绝发送
    statusFail (params) {
      /**
     * 修改
     * $this  vue组件
     * p.ref 验证
     * p.url 修改url
     * p.requestObject 请求参数对象
     * p.loading loading
     * p.showModel 界面模型显示隐藏
     */
    delete params.account
    delete params.subscription
    this.updateSignPrize=params
    this.updateSignPrize.status=4
    this.axiosbusiness.update(this,{
      url:'/signPrize/update',
      requestObject:'updateSignPrize',
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
    this.deleteSignPrize={
      "signPrizeId":params.signPrizeId
    };
    this.axiosbusiness.delete(this,{
      url:'/signPrize/delete',
      requestObject:'deleteSignPrize'
    })
    },
    //导出数据
   /*  exportData (type) {
      this.$refs.table.exportCsv({
          filename: '签到奖品',
          columns: this.signPrizeCoumns,
          data: this.signPrizeList
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
