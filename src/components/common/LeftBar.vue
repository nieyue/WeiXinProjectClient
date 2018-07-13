<!-- 左侧导航-->
<template>
   <Sider class="leftbar-wrap" >
            <Menu :active-name="menuActiveName"  @on-select="menuSelect" theme="dark" width="auto">
                <Submenu name="config">
                    <template slot="title">
                        <Icon type="gear-a"></Icon>
                        配置管理
                    </template>
                    <MenuItem :name="menu.config.welcome">欢迎页</MenuItem>
                </Submenu>
                <Submenu name="subscription">
                    <template slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        公众号管理
                    </template>
                    <MenuItem :name="menu.subscription.subscription">公众号</MenuItem>
                </Submenu>
                <Submenu name="sign">
                    <template slot="title">
                        <Icon type="pizza"></Icon>
                        签到奖品管理
                    </template>
                   <!--  <MenuItem :name="menu.sign.sign">签到</MenuItem>
                    <MenuItem :name="menu.sign.signRecord">签到记录</MenuItem> -->
                    <MenuItem :name="menu.sign.prize">奖品</MenuItem>
                    <!-- <MenuItem :name="menu.sign.signPrize">签到奖品</MenuItem> -->
                </Submenu>
                <Submenu name="account">
                    <template slot="title">
                        <Icon type="person"></Icon>
                        账户管理
                    </template>
                    <MenuItem name="/main/account/userAccount">用户账户</MenuItem> 
                    <MenuItem name="/main/account/spreadAccount">推广户账户</MenuItem> 
                    <MenuItem name="/main/account/sellerAccount">商户账户</MenuItem> 
                </Submenu>
                <Submenu v-if="isSuperAdmin" name="rolePermission">
                    <template slot="title">
                        <Icon type="person-stalker"></Icon>
                        角色权限管理
                    </template>
                    <MenuItem  :name="menu.rolePermission.role">角色</MenuItem>
                    <MenuItem name="/main/permission">权限</MenuItem>
                </Submenu>
                <!-- <Submenu name="finance">
                    <template slot="title">
                        <Icon type="social-yen"></Icon>
                        财务管理
                    </template>
                    <MenuItem name="/main/Withdrawals">提现管理</MenuItem>
                </Submenu> -->
                <Submenu v-if="isSuperAdmin" name="managerAccount">
                    <template slot="title">
                        <Icon type="person-stalker"></Icon>
                        管理员管理
                    </template>
                    <MenuItem name="/main/account/managerAccount">管理员管理</MenuItem>
                </Submenu>
            </Menu>
        </Sider>
</template>
<script>
      export default {
    name: 'LeftBar',
    data () {
      return {
          //菜单
          menu:{},
          //活动的菜单，即显示菜单
          menuActiveName:'/main/articeCate'
       
      }
    },
    methods: {
     menuSelect(name){
         this.$router.push(name);
     },
     //初始化菜单
     initMenu(){
         let pp=JSON.stringify(this.pathParams)
         this.menu={
             //配置
            config:{
                 welcome:"/main/welcome/"+pp
            },
             //公众号
            subscription:{
                 subscription:"/main/subscription/"+pp
            },
             //签到奖品
            sign:{
                 /* sign:"/main/sign/"+pp,
                 signRecord:"/main/signRecord/"+pp, */
                 prize:"/main/prize/"+pp,
                /*  signPrize:"/main/signPrize/"+pp, */
            },
             //角色权限
            rolePermission:{
                 role:"/main/role/"+pp
            },
         }
     }
    },
    watch:{

    },
    created(){
       //判断是否超级管理员
        this.isSuperAdmin=this.business.getIsSuperAdmin()
        this.pathParams={
          currentPage:1,//当前页
          accountId:this.business.getAccount().accountId  
        }
        this.initMenu();
    //this.isSuperAdmin= this.business.getIsSuperAdmin();
    //监听点击返回
    this.Hub.$on('routerChange', (msg) => { //Hub接收事件
        //this.msg = 'hehe';
        console.log(msg)
        this.menuActiveName=msg;
    });
    }
  }
</script>
<style lang="less">
@import "LeftBar.less";
</style>
