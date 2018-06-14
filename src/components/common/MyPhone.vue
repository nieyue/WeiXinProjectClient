<!--手机页组件 -->
<template>
    <div class="phone-bg-wrap">
        <div class="phone-bg">
        <img class="phone-bg-img" src="@/assets/devices-sprite.jpg"/>
        </div>
        <div class="phone-white">
            <img class="phone-white-img" src="@/assets/weixinstart.png">

        </div>
        <div class="phone-title">
            <img class="phone-title-img" src="@/assets/ios-statusbar.png">
        </div>
    </div>
</template>
<script>
export default {
  name: 'MyPhone',
  data () {
    return {
    }
  },
  methods: {
  },
  created () {
  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
/**
*手机整体
*/
.phone-bg-wrap{
    height: 500px;
    width:300px;
    position: relative;
    left: 0;
    top: 0;
    //手机背景图片
    .phone-bg{
        position: absolute;
        left: 0;
        top: 0;
        height: 500px;
        width:300px;
        overflow: hidden;
        .phone-bg-img{
            height: auto;
            width:300px;
        }
    }
    //手机背景白色
    .phone-white{
        position: absolute;
        left: 0;
        top: 50px;
        height: 380px;
        width:200px;
         margin-left:50px;
        background-color:#fff;
        .phone-white-img{
            height: 100%;
            width:200px;
        }
    }
    //手机title
    .phone-title{
        position: absolute;
        left: 0;
        top: 50px;
        height: auto;
        width:200px;
        margin-left:50px;
        overflow: hidden;
        .phone-title-img{
            height: auto;
            width:200px;
        }
    }
}

</style>

