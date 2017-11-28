<template>
  <div id="app" v-show="IsShow">
    <div class="banner">
      <img src="../../assets/logo.png" width="20%"/>
      <p>{{sname}}</p>
    </div>
    <div class="content">
      <div>
        <input type="text" v-model="MemberPhone" placeholder="请输入您的手机号" class="login_input">
      </div>
      <div>
        <input type="text" v-model="ValidCode" placeholder="输入验证码" class="login_input" style="width: 60%">
        <button @click="BindValidCode()" style="float: right; width: 35%; margin-top:10px;" v-bind:disabled="dis">{{btn_ValidCode}}</button>
      </div>
      <button @click="BindMobilePhone()">绑定</button>
    </div>
  </div>
</template>

<script>
  import {ajax} from "../../components/Base.js"
  export default {
    name: 'app',
    data () {
      return {
        sname: '商业会员系统',
        MemberPhone: null,
        IsShow: true,
        openid: null,
        access_token: null,
        ValidCode: null,
        dis: false,
        btn_ValidCode: "获取验证码",
        ResultValidCode: null
      }
    },
    methods: {
      BindMobilePhone: function () {
        var vue = this;
        if (this.ValidCode == null || this.ValidCode.trim() == "") {
          alert("请输入验证码！");
          return false;
        } else {
          if (this.ValidCode.trim() != vue.ResultValidCode) {
            alert("验证码输入不正确！");
            return false;
          }
          var RegCellPhone = /^([0-9]{11})?$/;
          if (RegCellPhone.test(this.MemberPhone)) {
            ajax.query(this, 'BindMobilePhone', {
              "openid": vue.openid,
              "access_token": vue.access_token,
              "MobilePhone": vue.MemberPhone
            }).then((res) => {
              if (res.data.result == 'true') {
                location.href = 'index.html';
              } else {
                alert("绑定失败！请您稍后再试");
                this.MemberPhone = "";
              }
            });
          } else {
            alert("手机号不合法");
          }
        }
      },
      //获取验证码
      BindValidCode: function () {
        var vue = this;
        if (this.MemberPhone == null || this.MemberPhone.trim() == "") {
          alert("请输入手机号");
          return false;
        } else {
          var RegCellPhone = /^([0-9]{11})?$/;
          if (RegCellPhone.test(this.MemberPhone)) {
            ajax.query(this, 'BindValidCode', {
              "MobilePhone": vue.MemberPhone
            }).then((res) => {
              if (res.data.result == 'true') {
                vue.ResultValidCode = res.data.validcode;
                //发送验证码，不能重复点击
                var time = 120;
                vue.btn_ValidCode = time-- + " 秒";
                vue.dis = true;
                var timer = setInterval(function () {
                  if (time > 0) {
                    vue.btn_ValidCode = time-- + " 秒";
                  } else {
                    clearInterval(timer);
                    vue.btn_ValidCode = "获取验证码";
                    vue.dis = false;
                  }
                }, 1000);
              } else {
                alert("获取验证码失败！请您稍后再试");
                this.MemberPhone = "";
              }
            });
          } else {
            alert("手机号不合法");
          }
        }
      }
    },
    created: function () {
      var vue = this;
      var reg = new RegExp("(^|&)" + "code" + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r !== null) {
        ajax.query(this, 'AnalysisCode', {"code": r[2]}).then((res) => {
          if (res.data.result == 'true') {
            vue.openid = res.data.openid;
            vue.access_token = res.data.access_token;
            ajax.query(this, 'Login', {
              "openid": vue.openid,
              "access_token": vue.access_token
            }).then((res) => {
              if (res.data.result == 'true') {
                location.href = 'index.html';
              } else {
                if (res.data.result == "Error") {
                  window.close();
                }
                else {
                  vue.openid = res.data.openid;
                  vue.access_token = res.data.access_token;
                  vue.IsShow = true;
                }
              }
            });
          } else {
            window.close();
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/css/common.less';
  @import '../../assets/css/page.less';

  .content {
    .p16;
  }

  .login_input {
    background-color: @whiteColor;
    line-height: 40px;
    height: 40px;
    margin-top: 10px;
    width: 100%;
    border: none;
    border-bottom: 1px solid @assistColor;
  }

  button {
    width: 100%;
    height: 40px;
    margin-top: 20px;
    border-radius: 5px;
    color: @whiteColor;
    border: none;
    background-color: @themeColor;
  }
</style>
