import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Main from '@/components/main/Main'
import ScheduleJob from '@/components/main/scheduleJob/ScheduleJob'
import Account from '@/components/main/account/Account'
import ManagerAccount from '@/components/main/account/ManagerAccount'
import Welcome from '@/components/main/config/Welcome'
import Subscription from '@/components/main/subscription/Subscription'
import KfMessage from '@/components/main/message/kfMessage'
import KfArticle from '@/components/main/message/KfArticle'
import TemplateMessage from '@/components/main/message/TemplateMessage'
import TemplateData from '@/components/main/message/TemplateData'
import Prize from '@/components/main/sign/Prize'
import Sign from '@/components/main/sign/Sign'
import SignRecord from '@/components/main/sign/SignRecord'
import WeixinMpMenu from '@/components/main/weixinMpMenu/WeixinMpMenu'
import SignPrize from '@/components/main/sign/SignPrize'
import ReceiptInfo from '@/components/main/ReceiptInfo/ReceiptInfo'
import Role from '@/components/main/rolePermission/Role'
import Permission from '@/components/main/rolePermission/Permission'
import RolePermission from '@/components/main/rolePermission/RolePermission'


Vue.use(Router)

const router= new Router({
 // export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: '首页',
      redirect: "/index"
    },
    {
      path: '/index',
      name: '首页',
      component: Index
    },
    {
      path: '/main',
      name: '主页',
      component: Main,
      children:[
        {
          path: 'welcome/:pathParams',
          name: '欢迎页',
          component: Welcome
        },
        {
          path: 'scheduleJob/:pathParams',
          name: '工作计划',
          component: ScheduleJob
        },
        {
          path: 'subscription/:pathParams',
          name: '公众号',
          component: Subscription
        },
        {
          path: 'weixinMpMenu/:pathParams',
          name: '微信公众号菜单',
          component: WeixinMpMenu
        },
        {
          path: 'kfMessage/:pathParams',
          name: '客服消息',
          component: KfMessage
        },
        {
          path: 'kfArticle/:pathParams',
          name: '客服消息文章',
          component: KfArticle
        },
        {
          path: 'templateMessage/:pathParams',
          name: '模板消息',
          component: TemplateMessage
        },
        {
          path: 'templateData/:pathParams',
          name: '模板数据',
          component: TemplateData
        },
        {
          path: 'prize/:pathParams',
          name: '奖品',
          component: Prize
        },
        {
          path: 'sign/:pathParams',
          name: '签到',
          component: Sign
        },
        {
          path: 'signRecord/:pathParams',
          name: '签到记录',
          component: SignRecord
        },
        {
          path: 'signPrize/:pathParams',
          name: '签到奖品',
          component: SignPrize
        },
        {
          path: 'receiptInfo/:pathParams',
          name: '收货地址',
          component: ReceiptInfo
        },
        {
          path: 'account',
          name: '账户',
          component: Account
        },
        {
          path: 'account',
          name: '账户',
          component: ManagerAccount,
          children:[
            {
              path: 'managerAccount',
              name: '管理员账户',
              component: ManagerAccount
            }]
        },
        {
          path: 'account',
          name: '账户',
          component: Account,
          children:[
            {
              path: 'userAccount',
              name: '用户账户',
              component: Account
            },
            {
              path: 'spreadAccount',
              name: '推广户账户',
              component: Account
            },
            {
              path: 'sellerAccount',
              name: '商户账户',
              component: Account
            }
          ]
        },
        {
          path: 'role/:pathParams',
          name: '角色',
          component: Role
        },
        {
          path: 'permission',
          name: '权限',
          component: Permission
        },
        {
          path: 'rolePermission/:roleId',
          name: '角色权限',
          component: RolePermission
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if(to.fullPath.indexOf("role")>0
  ||to.fullPath.indexOf("permission")>0
  ||to.fullPath.indexOf("rolePermission")>0){
    //判断是否超级管理员，是就显示账户管理
    if(sessionStorage.getItem("account")){
      let account=JSON.parse(sessionStorage.getItem("account"));
      if(account.role.name=="超级管理员"){
        next()
      }else{
        next(false)
      }
    }
  }else{
    next()
  }
  
})
export default router