import http from './http'

export const SUCCESS_CODE =20000;

//解析token
export const checkToken = () => {
    return http.requestGet('/user/check-token');
}

//登录
export const doLogin = (verifyCode,captcha_key,User) => {
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