import http from './http'

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