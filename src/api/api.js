import http from './http'

export const SUCCESS_CODE =20000;
export const FAILED_CODE =40000;

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

//获取轮播图列表
export const listLoop = () => {
    return http.requestGet('/admin/looper/list');
}

//添加轮播图
export const postLoop = (Loop) => {
    return http.requestPost('/admin/looper',Loop);
}

//删除轮播图
export const deleteLoop = (loopId) => {
    return http.requestDelete('/admin/looper/' + loopId);
}

//更新轮播图
export const updateLoop = (loopId,loop) => {
    return http.requestPut('/admin/looper/' + loopId, loop);
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

//获取邮箱验证码
export const getVerifyCode = (newEmail, type) => {
    return http.requestGet('/user/email_code?email=' +newEmail+ '&type=' +type);
}

//修改邮箱地址
export const updateEmailAddress = (oldEmailAdr,newEmailAdr,verifyCode) => {
    return http.requestPut('/user/email/?oldEmail=' +oldEmailAdr+ '&newEmail=' +newEmailAdr+ '&verify_code=' +verifyCode);
}

//检查用户名是否存在
export const checkUserName = (userName) => {
    return http.requestGet('/user/user_name?userName=' + userName);
}

//更新管理员信息
export const updateAdminInfo = (user,userId) => {
    return http.requestPut('/user/user_info/' + userId, user);
}

//获取SEO信息
export const getSeoInfo = () => {
    return http.requestGet('/admin/web_size_info/seo');
}

//获取网站标题
export const getWebSizeTitle = () => {
    return http.requestGet('/admin/web_size_info/title');
}

//更新网站标题
export const updateWebSizeTitle = (title) => {
    return http.requestPut('/admin/web_size_info/title?title=' + title);
}

//更新SEO信息
export const updateSeoInfo = (keyWords,description) => {
    return http.requestPut('/admin/web_size_info/seo?keywords=' + keyWords + '&description=' + description);
}

//获取友情链接列表
export const listFriendLink = () => {
    return http.requestGet('/admin/friend_link/list');
}

//添加友情链接
export const postFriendLink = (friend_link) => {
    return http.requestPost('/admin/friend_link',friend_link);
}

//更新友情链接
export const updateFriendLink = (friendLinkId,friendLink) => {
    return http.requestPut('/admin/friend_link/' + friendLinkId, friendLink);
}

//删除友情链接
export const deleteFriendLink = (friendLinkId) => {
    return http.requestDelete('/admin/friend_link/' +friendLinkId);
}