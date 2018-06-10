<!--客服消息管理 -->
<template>
    <div class="body-wrap">
    <div class="body-btn-wrap">
      <Button type='primary'  @click='add'>增加客服消息</Button>
    <!-- qa -->
    </div>
		 <!--新增 -->
     <Modal v-model="addKfMessageModel"
           title="新增客服消息管理"
           :closable="false"
           :mask-closable="false"
             width="1000px"
    >
      <Form ref="addKfMessage" :model="addKfMessage" :label-width="100" label-position="right"  :rules="addKfMessageRules">
        <FormItem prop="msgtyp" label="消息类型:">
          <Select v-model="addKfMessage.msgtype" transfer size="large" style="width:200px">
              <Option v-for="item in msgtypeList" :value="item.id" :key="item.id">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="content" v-show="addKfMessage.msgtype=='text'" label="客服消息内容:">
             <Input type="textarea" v-model="addKfMessage.content" placeholder="客服消息内容">
            </Input>
        </FormItem>
        <FormItem prop="mediaId" 
        v-if="addKfMessage.msgtype=='image'
        ||addKfMessage.msgtype=='voice'
        ||addKfMessage.msgtype=='video'
        ||addKfMessage.msgtype=='mpnews'" 
        label="发送的图片/语音/视频/图文消息（点击跳转到图文消息页）的媒体ID:">
          <Input type="text" v-model="addKfMessage.mediaId" placeholder="发送的图片/语音/视频/图文消息（点击跳转到图文消息页）的媒体ID">
          </Input>
        </FormItem>
        <FormItem prop="thumbMediaId"
        v-if="addKfMessage.msgtype=='music'
        ||addKfMessage.msgtype=='video'
        ||addKfMessage.msgtype=='miniprogrampage'"
         label="缩略图/小程序卡片图片的媒体ID，小程序卡片图片建议大小为520*416:">
          <Input type="text" v-model="addKfMessage.thumbMediaId" placeholder="缩略图/小程序卡片图片的媒体ID，小程序卡片图片建议大小为520*416">
          </Input>
        </FormItem>
        <FormItem prop="title" 
         v-if="addKfMessage.msgtype=='video'
        ||addKfMessage.msgtype=='music'
        ||addKfMessage.msgtype=='miniprogrampage'"
        label="视频消息/音乐消息/小程序卡片的标题:">
          <Input type="text" v-model="addKfMessage.title" placeholder="视频消息/音乐消息/小程序卡片的标题">
          </Input>
        </FormItem>
        <FormItem prop="description" 
         v-if="addKfMessage.msgtype=='video'
        ||addKfMessage.msgtype=='music'"
        label="视频消息/音乐消息的描述:">
          <Input type="text" v-model="addKfMessage.description" placeholder="视频消息/音乐消息的描述">
          </Input>
        </FormItem>
        <FormItem prop="musicurl" 
        v-if="addKfMessage.msgtype=='music'" label="音乐链接:">
          <Input type="text" v-model="addKfMessage.musicurl" placeholder="音乐链接">
          </Input>
        </FormItem>
        <FormItem prop="hqmusicurl" v-if="addKfMessage.msgtype=='music'" label="高品质音乐链接，wifi环境优先使用该链接播放音乐:">
          <Input type="text" v-model="addKfMessage.hqmusicurl" placeholder="高品质音乐链接，wifi环境优先使用该链接播放音乐">
          </Input>
        </FormItem>
        <FormItem prop="cardId" v-if="addKfMessage.msgtype=='wxcard'" label="卡卷id:">
          <Input type="text" v-model="addKfMessage.cardId" placeholder="卡卷id">
          </Input>
        </FormItem>
        <FormItem prop="appid" v-if="addKfMessage.msgtype=='miniprogrampage'" label="小程序的appid，要求小程序的appid需要与公众号有关联关系:">
          <Input type="text" v-model="addKfMessage.appid" placeholder="小程序的appid，要求小程序的appid需要与公众号有关联关系">
          </Input>
        </FormItem>
        <FormItem prop="pagepath" v-if="addKfMessage.msgtype=='miniprogrampage'" label="小程序的页面路径，跟app.json对齐，支持参数，比如pages/index/index?foo=bar:">
          <Input type="text" v-model="addKfMessage.pagepath" placeholder="小程序的页面路径，跟app.json对齐，支持参数，比如pages/index/index?foo=bar">
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
     <Modal v-model="updateKfMessageModel"
           title="修改客服消息管理"
           :closable="false"
           :mask-closable="false"
             width="1000px"
    >
      <Form ref="updateKfMessage" :model="updateKfMessage" :label-width="100" label-position="right"  :rules="updateKfMessageRules">
        <FormItem prop="msgtype" label="消息类型:">
          <Select v-model="updateKfMessage.msgtype" disabled="disabled" transfer size="large" style="width:200px">
              <Option v-for="item in msgtypeList" :value="item.id" :key="item.id">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="content" v-show="updateKfMessage.msgtype=='text'" label="客服消息内容:">
            <Input type="textarea" v-model="updateKfMessage.content" placeholder="客服消息内容">
            </Input>
        </FormItem>
        <FormItem prop="mediaId" 
         v-if="updateKfMessage.msgtype=='image'
        ||updateKfMessage.msgtype=='voice'
        ||updateKfMessage.msgtype=='video'
        ||updateKfMessage.msgtype=='mpnews'"
        label="发送的图片/语音/视频/图文消息（点击跳转到图文消息页）的媒体ID:">
          <Input type="text" v-model="updateKfMessage.mediaId" placeholder="发送的图片/语音/视频/图文消息（点击跳转到图文消息页）的媒体ID">
          </Input>
        </FormItem>
        <FormItem prop="thumbMediaId" 
         v-if="updateKfMessage.msgtype=='music'
         ||updateKfMessage.msgtype=='video'
        ||updateKfMessage.msgtype=='miniprogrampage'"
        label="缩略图/小程序卡片图片的媒体ID，小程序卡片图片建议大小为520*416:">
          <Input type="text" v-model="updateKfMessage.thumbMediaId" placeholder="缩略图/小程序卡片图片的媒体ID，小程序卡片图片建议大小为520*416">
          </Input>
        </FormItem>
        <FormItem prop="title" 
         v-if="updateKfMessage.msgtype=='video'
        ||updateKfMessage.msgtype=='music'
        ||updateKfMessage.msgtype=='miniprogrampage'"
        label="视频消息/音乐消息/小程序卡片的标题:">
          <Input type="text" v-model="updateKfMessage.title" placeholder="视频消息/音乐消息/小程序卡片的标题">
          </Input>
        </FormItem>
        <FormItem prop="description" 
        v-if="updateKfMessage.msgtype=='video'
        ||updateKfMessage.msgtype=='music'"
        label="视频消息/音乐消息的描述:">
          <Input type="text" v-model="updateKfMessage.description" placeholder="视频消息/音乐消息的描述">
          </Input>
        </FormItem>
        <FormItem prop="musicurl" v-if="updateKfMessage.msgtype=='music'" label="音乐链接:">
          <Input type="text" v-model="updateKfMessage.musicurl" placeholder="音乐链接">
          </Input>
        </FormItem>
        <FormItem prop="hqmusicurl" v-if="updateKfMessage.msgtype=='music'" label="高品质音乐链接，wifi环境优先使用该链接播放音乐:">
          <Input type="text" v-model="updateKfMessage.hqmusicurl" placeholder="高品质音乐链接，wifi环境优先使用该链接播放音乐">
          </Input>
        </FormItem>
        <FormItem prop="cardId" v-if="updateKfMessage.msgtype=='wxcard'" label="卡卷id:">
          <Input type="text" v-model="updateKfMessage.cardId" placeholder="卡卷id">
          </Input>
        </FormItem>
        <FormItem prop="appid" v-if="updateKfMessage.msgtype=='miniprogrampage'" label="小程序的appid，要求小程序的appid需要与公众号有关联关系:">
          <Input type="text" v-model="updateKfMessage.appid" placeholder="小程序的appid，要求小程序的appid需要与公众号有关联关系">
          </Input>
        </FormItem>
        <FormItem prop="pagepath" v-if="updateKfMessage.msgtype=='miniprogrampage'" label="小程序的页面路径，跟app.json对齐，支持参数，比如pages/index/index?foo=bar:">
          <Input type="text" v-model="updateKfMessage.pagepath" placeholder="小程序的页面路径，跟app.json对齐，支持参数，比如pages/index/index?foo=bar">
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
      <Table border :columns='kfMessageColumns' :data='kfMessageList' ref='table' size="small"></Table>
        <div style='display: inline-block;float: right; margin-top:10px;'>
        <Page style='margin-right:10px;' :current="params.currentPage"  :total='params.total' :pageSize='params.pageSize' ref='page' :show-total='true'   @on-change='selectPage' show-elevator ></Page>
      </div>
    </div>
</template>
<script>
export default {
  name: 'KfMessage',
  data () {
    return {
        params:{
            startNum:1,//初始化个数
            currentPage:1,//当前页
            pageNum:1,//获取的第几个开始
            pageSize:10,//每页的个数
            total:0//总数
        },
        //消息类型text文本消息，image图片消息，voice语音消息，video视频消息，music音乐消息，
        //news图文消息（外链），mpnews图文消息（微信链接），wxcard发送卡券，miniprogrampage小程序
        msgtypeList:[
            {id:'text',value:'文本消息'},
            {id:'image',value:'图片消息'},
            {id:'voice',value:'语音消息'},
            {id:'video',value:'视频消息'},
            {id:'music',value:'音乐消息'},
            {id:'news',value:'图文消息（外链）'},
            {id:'mpnews',value:'图文消息（微信链接）'},
            {id:'wxcard',value:'发送卡券'},
            {id:'miniprogrampage',value:'小程序'}
        ],
			//增加参数
			addKfMessageModel:false,
			addLoading:false,
			addKfMessageRules: {
                msgtype: [
                    {type:"number",required: true, message: '客服消息类型为必填项', trigger: 'change'}
                    ],
                },
			addKfMessage:{
			},
			//修改参数
			updateKfMessageModel:false,
			updateLoading:false,
			updateKfMessageRules: {
                name: [
                    {type:"number",required: true, message: '客服消息类型为必填项', trigger: 'change'}
                    ],
                },
			updateKfMessage:{
      },
        //删除参数
        deleteKfMessage:{},
	    kfMessageList: [],
	    kfMessageColumns: [
        {
          title: '序号',
          align:'center',
          render: (h, params) => {
            return h('span', params.index
            +(this.params.currentPage-1)*this.params.pageSize+this.params.startNum);
          }
        },
        {
          title: '客服消息id',
          key: 'kfMessageId',
          align:'center'
        },
         {
        	title:'消息类型',
            key:'msgtype',
             width:100,
          align:'center',
          render: (h, params) => {
            let msgtypevalue="";
            this.msgtypeList.forEach(element => {
              if(element.id==params.row.msgtype){
                msgtypevalue=element.value;
              }
            });
            let vvv=h('div',"");
            if(params.row.msgtype=='news'){
                vvv=h('div',[
                   h('div',msgtypevalue) ,
                   h('Button', {
                    props: {
                    type: 'primary',
                    size: 'small'
                    },
                    on: {
                    click: () => {
                         let  pp=JSON.stringify({
                            currentPage:1,//当前页
                            kfMessageId:params.row.kfMessageId
                            });
                    this.$router.push('/main/kfArticle/'+pp);
                    }
                    }
                }, '外链文章')
                ]);
            }else{
                vvv=h('div',[
                   h('div',msgtypevalue) ,
                ]);
            }
             return vvv;
          }
        },
        {
            title:'文本消息内容',
            //key:'content',
            align:'center',
              render: (h, params) => {
            return h("span",(params.row.content+"").substr(0,20)+"...");
            }
        },
        {
        	title:'发送的图片/语音/视频/图文消息（点击跳转到图文消息页）的媒体ID',
        	key:'mediaId',
            align:'center'
        },
        {
        	title:'缩略图/小程序卡片图片的媒体ID，小程序卡片图片建议大小为520*416',
        	key:'thumbMediaId',
            align:'center'
        },
        {
        	title:'视频消息/音乐消息/小程序卡片的标题',
        	key:'title',
            align:'center'
        },
        {
        	title:'视频消息/音乐消息的描述',
        	key:'description',
            align:'center'
        },
        {
        	title:'音乐链接',
        	key:'musicurl',
            align:'center'
        },
        {
        	title:'高品质音乐链接，wifi环境优先使用该链接播放音乐',
        	key:'hqmusicurl',
            align:'center'
        },
        {
        	title:'卡卷id',
        	key:'cardId',
            align:'center'
        },
        {
        	title:'小程序的appid，要求小程序的appid需要与公众号有关联关系',
        	key:'appid',
            align:'center'
        },
        {
        	title:'小程序的页面路径，跟app.json对齐，支持参数，比如pages/index/index?foo=bar',
        	key:'pagepath',
            align:'center'
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
          fixed:'right',
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
                style:{
                    margin:'12px 0'
                },
                on: {
                  click: () => {
                   this.sendKfMessage(params.row)
                  }
                }
              }, '群发消息');
            	var s=h("div","");
			s=h("div",[
                ("div",[
              varhh1,
              varhh2
            ]),
              varhh3
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
        subscriptionId:JSON.parse(this.$route.params.pathParams).subscriptionId
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
     this.params.subscriptionId=JSON.parse(this.$route.params.pathParams).subscriptionId
     this.axiosbusiness.getList(this,{
       countUrl:'/kfMessage/count',
       listUrl:'/kfMessage/list',
       data:'kfMessageList'
     },this.params)
    },
  //增加
	 add (params) {
      this.addKfMessageModel = true
      this.addKfMessage={
          content:null
      }
    },
		//增加取消
		 addCancel () {
      if (!this.addLoading) {
        this.addKfMessageModel = false
        this.$refs.addKfMessage.resetFields()
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
    this.addKfMessage.subscriptionId=JSON.parse(this.$route.params.pathParams).subscriptionId
    this.axiosbusiness.add(this,{
      ref:'addKfMessage',
      url:'/kfMessage/add',
      requestObject:'addKfMessage',
      loading:'addLoading',
      showModel:'addKfMessageModel'
    })
    },
	 update (params) {
      this.updateKfMessageModel = true
      //获取修改实体
      this.axiosbusiness.get(this,{
         url:'/kfMessage/load?kfMessageId='+params.kfMessageId,
         data:'updateKfMessage',
       })
    },
		//修改取消
		 updateCancel () {
      if (!this.updateLoading) {
        this.updateKfMessageModel = false
        this.$refs.updateKfMessage.resetFields()
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
      ref:'updateKfMessage',
      url:'/kfMessage/update',
      requestObject:'updateKfMessage',
      loading:'updateLoading',
      showModel:'updateKfMessageModel'
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
    this.deleteKfMessage={
      "kfMessageId":params.kfMessageId
    };
    this.axiosbusiness.delete(this,{
      url:'/kfMessage/delete',
      requestObject:'deleteKfMessage'
    })
    },
    //发送消息
    sendKfMessage(params){
    /**
     * post发送请求
     * $this  vue组件
     * p.url 修改url
     * p.title 名称
     * p.content 请求内容
     * p.requestObject 请求参数对象
     * p.success 成功回调
     */
    this.requestObject={
      "kfMessageId":params.kfMessageId
    };
    this.axiosbusiness.post(this,{
      url:'/kfMessage/sendKfMessage',
      title:'群发消息',
      content:'确定群发消息吗？',
      requestObject:'requestObject'
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
