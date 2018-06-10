import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Main from '@/components/main/Main'
import Account from '@/components/main/account/Account'
import Welcome from '@/components/main/config/Welcome'
import Subscription from '@/components/main/subscription/Subscription'
import KfMessage from '@/components/main/message/kfMessage'
import KfArticle from '@/components/main/message/KfArticle'
import Prize from '@/components/main/sign/Prize'
import Sign from '@/components/main/sign/Sign'
import SignRecord from '@/components/main/sign/SignRecord'
import SignPrize from '@/components/main/sign/SignPrize'
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
          path: 'subscription/:pathParams',
          name: '公众号',
          component: Subscription
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
          path: 'account',
          name: '账户',
          component: Account
        },
        {
          path: 'account',
          name: '账户',
          component: Account,
          children:[
            {
              path: 'managerAccount',
              name: '管理员账户',
              component: Account
            },
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