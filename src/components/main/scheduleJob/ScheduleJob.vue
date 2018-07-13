<!--工作任务管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
        <Alert>
            注意：固定时间规则是一次性发送，自定义规则（cron表达式）是可以一次性也可以多次循环触发。<br/>
            自定义规则例子：<br/>
            0 0 12 * * ?	每天12点运行<hr/>
            0 15 10 ? * *	每天10:15运行<hr/>
            0 15 10 * * ?	每天10:15运行<hr/>
            0 15 10 * * ? *	每天10:15运行<hr/>
            0 15 10 * * ? 2008	在2008年的每天10：15运行<hr/>
            0 * 14 * * ?	每天14点到15点之间每分钟运行一次，开始于14:00，结束于14:59。<hr/>
            0 0/5 14 * * ?	每天14点到15点每5分钟运行一次，开始于14:00，结束于14:55。<hr/>
            0 0/5 14,18 * * ?	每天14点到15点每5分钟运行一次，此外每天18点到19点每5钟也运行一次。<hr/>
            0 0-5 14 * * ?	每天14:00点到14:05，每分钟运行一次。<hr/>
            0 10,44 14 ? 3 WED	3月每周三的14:10分到14:44，每分钟运行一次。<hr/>
            0 15 10 ? * MON-FRI	每周一，二，三，四，五的10:15分运行。<hr/>
            0 15 10 15 * ?	每月15日10:15分运行。<hr/>
            0 15 10 L * ?	每月最后一天10:15分运行。<hr/>
            0 15 10 ? * 6L	每月最后一个星期五10:15分运行。<hr/>
            0 15 10 ? * 6L 2007-2009	在2007,2008,2009年每个月的最后一个星期五的10:15分运行。<hr/>
            0 15 10 ? * 6#3	每月第三个星期五的10:15分运行。<hr/>
        </Alert>       
    </div> 
    <div class="body-btn-wrap">
      <Button type='primary'  @click='add'>增加工作任务</Button> 
    </div>
		 <!--新增 -->
     <Modal v-model="addScheduleJobModel"
           title="新增工作任务管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="addScheduleJob" :model="addScheduleJob" :label-width="100" label-position="right"  :rules="addScheduleJobRules">
        <FormItem prop="cronExpression" label="规则:">
          <RadioGroup v-model="addCronSelector">
            <Radio label="1">固定时间规则</Radio>
            <Radio label="2">自定义规则（cron表达式）</Radio>
          </RadioGroup>
        <DatePicker type="datetime" v-if="addCronSelector=='1'"  @on-change="getAddCronExpression"  placeholder="选择一个固定时间" style="width: 200px"></DatePicker>
        <Input type="text" v-if="addCronSelector=='2'" v-model="addScheduleJob.cronExpression"  placeholder="cron表达式">
          </Input>
        </FormItem>
        <FormItem prop="description" label="任务描述:">
          <Input v-model="addScheduleJob.description" type="textarea" :rows="4" placeholder="工作任务名"></Input>
        </FormItem>
        <FormItem prop="jobId" label="业务ID:">
          <Input type="text" v-model="addScheduleJob.jobId" placeholder="业务ID">
          </Input>
        </FormItem>
        <FormItem prop="type" label="业务类型:">
          <Select v-model="addScheduleJob.type" transfer size="large" style="width:100px">
              <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="status" label="状态:">
          <Select v-model="addScheduleJob.jobStatus" transfer size="large" style="width:100px">
              <Option v-for="item in jobStatusList" :value="item.id" :key="item.id">{{ item.value }}</Option>
          </Select>
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
     <Modal v-model="updateScheduleJobModel"
           title="修改工作任务管理"
           :closable="false"
           :mask-closable="false"
    >
      <Form ref="updateScheduleJob" :model="updateScheduleJob" :label-width="100" label-position="right"  :rules="updateScheduleJobRules">
          <FormItem prop="cronExpression" label="规则:">
          <RadioGroup v-model="updateCronSelector">
            <Radio label="1">固定时间规则</Radio>
            <Radio label="2">自定义规则（cron表达式）</Radio>
          </RadioGroup>
        <DatePicker type="datetime" v-if="updateCronSelector=='1'"@on-change="getUpdateCronExpression" placeholder="选择一个固定时间" style="width: 200px"></DatePicker>
        <Input type="text" v-if="updateCronSelector=='2'" v-model="updateScheduleJob.cronExpression" placeholder="cron表达式">
          </Input>
        </FormItem>
        <FormItem prop="description" label="任务描述:">
          <Input v-model="updateScheduleJob.description" type="textarea" :rows="4" placeholder="工作任务名"></Input>
        </FormItem>
        <FormItem prop="jobId" label="业务ID:">
          <Input type="text" v-model="updateScheduleJob.jobId" placeholder="业务ID">
          </Input>
        </FormItem>
        <FormItem prop="type" label="业务类型:">
          <Select v-model="updateScheduleJob.type" transfer size="large" style="width:100px">
              <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="status" label="状态:">
          <Select v-model="updateScheduleJob.jobStatus" transfer size="large" style="width:100px">
              <Option v-for="item in jobStatusList" :value="item.id" :key="item.id">{{ item.value }}</Option>
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
      <Table border :columns='scheduleJobColumns' :data='scheduleJobList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;'  :current="params.currentPage" :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
</template>
<script>
export default {
  name: 'ScheduleJob',
  data () {
    return {
        //规则默认1,
        addCronSelector:"1",
        //规则默认1,
        updateCronSelector:"1",
        params:{
            startNum:1,//初始化个数
            currentPage:1,//当前页
            pageNum:1,//获取的第几个开始
            pageSize:10,//每页的个数
            total:0//总数
        },
        jobStatusList:[
            {id:'NORMAL',value:'正常'},
            {id:'PAUSED',value:'暂停'}
        ],
        typeList:[
            {id:1,value:'客服消息'},
            {id:2,value:'模板消息'}
        ],
			//增加参数
			addScheduleJobModel:false,
			addLoading:false,
			addScheduleJobRules: {
                jobId: [
                    {required: true, message: '工作任务jobId为必填项', trigger: 'blur'}
                    ],
                },
			addScheduleJob:{
			},
			//修改参数
			updateScheduleJobModel:false,
			updateLoading:false,
			updateScheduleJobRules: {
                jobId: [
                    {required: true, message: '工作任务jobId为必填项', trigger: 'blur'}
                    ],
                },
			updateScheduleJob:{
      },
      //删除参数
      deleteScheduleJob:{},
	    scheduleJobList: [],
	    scheduleJobColumns: [
        {
          title: '序号',
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '工作任务id',
          key: 'scheduleJobId',
          align:'center'
        },
        {
        	title:'任务组',
        	key:'jobGroup',
          align:'center'
        },
        {
        	title:'cron表达式',
        	key:'cronExpression',
          align:'center'
        },
        {
        	title:'任务描述',
        	key:'description',
          align:'center'
        },
        {
        	title:'业务ID',
        	key:'jobId',
          align:'center'
        },
        {
        	title:'业务类型',
          align:'center',
          render: (h, params) => {
              let typevalue="";
            this.typeList.forEach(element => {
              if(element.id==params.row.type){
                typevalue=element.value;
              }
            });
             return  h('span',typevalue);
          }
        },
        {
        	title:'状态',
          align:'center',
          render: (h, params) => {
              let jobStatusvalue="";
            this.jobStatusList.forEach(element => {
              if(element.id==params.row.jobStatus){
                jobStatusvalue=element.value;
              }
            });
             return  h('span',jobStatusvalue);
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
    //获取cron
    getAddCronExpression(data){
       this.addScheduleJob.cronExpression=this.dateToCron(new Date(data));
    },
    //获取cron
    getUpdateCronExpression(data){
        this.updateScheduleJob.cronExpression=this.dateToCron(new Date(data));
    },
    //时间转cron
    dateToCron(timeStamp){
        let date = new Date(timeStamp);
        let Y = date.getFullYear();
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) ;
        let D = date.getDate() ;
        let h = date.getHours() ;
        let m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
        let s = (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds()); 
    return s+' '+m+' '+h+" "+D+" "+M+" "+"? "+Y; 
    },
    //分页点击
    selectPage (currentPage) {
      this.params.currentPage=currentPage;
      this.params.pageNum = (this.params.currentPage-1)*this.params.pageSize+this.params.startNum;
      //构造path
     let pp=JSON.stringify({
       currentPage:currentPage,
       jobId:JSON.parse(this.$route.params.pathParams).jobId,
       type:JSON.parse(this.$route.params.pathParams).type
     })
     this.addScheduleJob.jobId=JSON.parse(this.$route.params.pathParams).jobId;
     this.addScheduleJob.type=JSON.parse(this.$route.params.pathParams).type;
     this.updateScheduleJob.jobId=JSON.parse(this.$route.params.pathParams).jobId;
     this.updateScheduleJob.type=JSON.parse(this.$route.params.pathParams).type;
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
     this.axiosbusiness.getList(this,{
       countUrl:'/scheduleJob/count',
       listUrl:'/scheduleJob/list',
       data:'scheduleJobList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addScheduleJobModel = true
      this.addScheduleJob.jobStatus=this.jobStatusList[0].id
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addScheduleJobModel = false
        this.$refs.addScheduleJob.resetFields()
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
      ref:'addScheduleJob',
      url:'/scheduleJob/add',
      requestObject:'addScheduleJob',
      loading:'addLoading',
      showModel:'addScheduleJobModel'
    })
    },
	 update (params) {
      this.updateScheduleJobModel = true
      //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/scheduleJob/load?scheduleJobId='+params.scheduleJobId,
         data:'updateScheduleJob',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateScheduleJobModel = false
        this.$refs.updateScheduleJob.resetFields()
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
      ref:'updateScheduleJob',
      url:'/scheduleJob/update',
      requestObject:'updateScheduleJob',
      loading:'updateLoading',
      showModel:'updateScheduleJobModel'
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
    this.deleteScheduleJob={
      "scheduleJobId":params.scheduleJobId
    };
    this.axiosbusiness.delete(this,{
      url:'/scheduleJob/delete',
      requestObject:'deleteScheduleJob'
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
