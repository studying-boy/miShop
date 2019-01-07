/**
 * Created by Administrator on 2018/4/18.
 */
import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);
let store = new Vuex.Store({
    state:{
        isLogin : sessionStorage.getItem("userName")?true:false,
        adminLogin : sessionStorage.getItem("adminName")?true:false,
        isEmptyCart : true,
        userInfo: {}
    },
    mutations:{
        LOGIN(state){                            //设置登录状态
            state.isLogin = true;
        },
        ADMINLOGIN(state){                            //设置管理员登录状态
            state.adminLogin = true;
        },
        SETUSER(state, result){                  //设置用户session
            state.userInfo = result;
            var res = JSON.stringify(result);   //需要将对象转化成字符串，才能存进session
            sessionStorage.setItem("userName", res);
        },
        SETADMIN(state, result){                  //设置管理员session
            state.adminInfo = result;
            var res = JSON.stringify(result);   //需要将对象转化成字符串，才能存进session
            sessionStorage.setItem("adminName", res);
        },
        REFRESH(state){                         //刷新页面重新获取用户session
            state.userInfo = JSON.parse(sessionStorage.getItem("userName"));
        },
        ADMINREFRESH(state){                         //刷新页面重新获取用户session
            state.userInfo = JSON.parse(sessionStorage.getItem("adminName"));
        },
        CHANGECART(state){
            state.isEmptyCart = false;
        }
    },
    getters:{

    },
    actions:{
        login(context){
            context.commit("LOGIN");
        },
        setUser(context, result){
            context.commit("SETUSER", result);
        },
        refresh(context, result){
            context.commit("REFRESH", result);
        },
        changeCart(context){
            context.commit("CHANGECART");
        },

        /*管理员*/
        adminLogin(context){
            context.commit("ADMINLOGIN");
        },
        setAdmin(context, result){
            context.commit("SETADMIN", result);
        },
        adminRefresh(context, result){
            context.commit("ADMINREFRESH", result);
        }
    },
})

export default store;
