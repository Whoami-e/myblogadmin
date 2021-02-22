import http from './http'
import {hex_md5} from "@/utils/md5";

export const SUCCESS_CODE =20000;

//解析token
export const checkToken = () => {
    return http.requestGet('/user/check-token');
}

//登录
export const doLogin = (verifyCode,captcha_key,User) => {
    User.password = hex_md5(User.password);
    return http.requestPost('/user/login/' + verifyCode+ '/' + captcha_key + '?from=p_',User);
}

//获取分类列表
export const listCategories = () => {
    return http.requestGet('/admin/category/list');
}

//删除分类
export const deleteCategoryById = (categoryId) => {
    return http.requestDelete('/admin/category/' +categoryId);
}

//添加分类
export const addCategory = (category) => {
    return http.requestPost('/admin/category',category);
}

//更新分类
export const updateCategory = (categoryId, category) => {
    return http.requestPut('/admin/category/' +categoryId,category);
}

//获取用户列表
export const listUsers = (pageNum,pageSize) => {
    return http.requestGet('/user/list?page=' + pageNum + '&size=' + pageSize);
}

//条件搜索用户
export const doUserSearch = (userName,email) => {
    return http.requestGet('/user/list?page=1&size=5&userName=' +userName+ '&email=' +email);
}

//删除用户
export const deleteUserById = (userId) => {
    return http.requestDelete('/user/' +userId);
}

//重置密码（管理员）
export const resetPassword = (userId,password) => {
    return http.requestPut('/user/reset-password/' + userId + '?password=' + password);
}