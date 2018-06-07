<!-- 顶部 -->
<template>
    <div class="topbar">
        <div class="topbar-left">
            <img src=""/>
            <span class="topbar-left-title">微信项目后台</span>
        </div>
        <div class="topbar-right" v-if="islogin">
            <span  class="topbar-right-logintext" v-text="account.realname||account.nickname||account.phone" ></span>
            <Button type="text"  class="topbar-right-loginout" @click="loginout">退出</Button>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'TopBar',
    created(){ 
      //是否登陆
      this.getIslogin();
    },
    watch: {
  //   //监听父组件的变量
  //  'isLogin': function (n, o) {
  //    console.log(n)
  //   this.islogin=n;
  //  },
  //   //监听自身的变量
  //  'islogin': function (n, o) {
  //    console.log(n)
  //   this.islogin=n;
  //  }
  },
    data () {
      return {
        islogin:false,
        account:{}
      }
    },
    methods: {
      //退出登陆
     loginout(){
      this.$Modal.confirm({
              title: '退出登陆？',
              content: '<p>确定退出登陆吗？</p>',
              onOk: () => {
                this.axios({
                method:"post",
                url:'/account/loginout?accountId='+this.business.getAccount().accountId,
                withCredentials: true
              }).
              then(res => {
                console.log(res)
                if (res.data.code == 200) {
                  this.islogin=true;
                  sessionStorage.clear();
                  this.$emit("islogin",this.islogin);
                  this.$Message.success('退出成功！');
                  this.$router.push('/')
                } else {
                  this.$emit("islogin",this.islogin);
                  this.$Message.error('失败')
                }
              }).catch(res => {
                this.$Message.error('系统异常')
              })
              },
              onCancel: () => {
                  this.$Message.success('取消成功！');
              }
          });
     },
      //验证是否登陆
      getIslogin(){
        if(!sessionStorage.getItem("account")){
          sessionStorage.clear()
          this.$emit("islogin",this.islogin);
          this.$router.push('/')
          this.$Message.info('请登录')
          return;
        }
        this.axios({
               method:"post",
               url:'/account/islogin',
               withCredentials: true
            }).
            then(res => {
              console.log(res)
              if (res.data.code == 200) {
                this.islogin=true;
                //设置本地account
                this.account=res.data.data[0];
                this.$emit("islogin",this.islogin);
                //this.$router.push('/main')
              } else {
                sessionStorage.clear()
                this.$emit("islogin",this.islogin);
                this.$router.push('/')
                this.$Message.info('请登录')
              }
            }).catch(res => {
              this.$Message.error('系统异常')
            })
      }
    }
  }
</script>
<style lang="less">
@import "TopBar.less";
</style>
