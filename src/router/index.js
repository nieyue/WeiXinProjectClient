import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Main from '@/components/main/Main'
import MerSearch from '@/components/main/mer/MerSearch'
import MerCommon from '@/components/main/mer/MerCommon'
import MerCate from '@/components/main/mer/MerCate'
import Mer from '@/components/main/mer/Mer'
import MerCardCipher from '@/components/main/mer/MerCardCipher'
import MerNotice from '@/components/main/mer/MerNotice'
import MerImg from '@/components/main/mer/MerImg'
import Account from '@/components/main/account/Account'
import Welcome from '@/components/main/config/Welcome'
import Subscription from '@/components/main/subscription/Subscription'
import Prize from '@/components/main/sign/Prize'
import Sign from '@/components/main/sign/Sign'
import Role from '@/components/main/rolePermission/Role'
import Permission from '@/components/main/rolePermission/Permission'
import RolePermission from '@/components/main/rolePermission/RolePermission'


Vue.use(Router)

const router= new Router({
 // export default new Router({
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
          path: 'merSearch',
          name: '商品搜索',
          component: MerSearch
        },
        {
          path: 'merCommon',
          name: '商品公用',
          component: MerCommon
        },
        {
          path: 'merCate',
          name: '商品类型',
          component: MerCate
        },
        {
          path: 'mer',
          name: '商品',
          component: Mer
        },
        {
          path: 'merCardCipher/:merId',
          name: '商品卡密',
          component: MerCardCipher
        },
        {
          path: 'merNotice/:merId',
          name: '商品公告',
          component: MerNotice
        },
        {
          path: 'merImg/:merId',
          name: '商品图片',
          component: MerImg
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