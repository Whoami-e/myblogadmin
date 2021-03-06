import http from './http'

export const SUCCESS_CODE =20000;
export const FAILED_CODE =40000;
export const websocket = 'ws://192.168.26.192:8080/log'

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

//恢复分类
export const restoreCategoryById = (categoryId) => {
    return http.requestPut('/admin/category/restore/' +categoryId);
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
export const listUsers = (pageNum,pageSize,userName,email) => {
    return http.requestGet('/user/list?page=' + pageNum + '&size=' + pageSize+'&userName=' +userName+ '&email=' +email);
}

//条件搜索用户
export const doUserSearch = (userName,email) => {
    return http.requestGet('/user/list?page=1&size=10&userName=' +userName+ '&email=' +email);
}

//删除用户
export const deleteUserById = (userId) => {
    return http.requestDelete('/user/' +userId);
}

//恢复用户
export const restoreUser = (userId) => {
    return http.requestPut('/user/' +userId);
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

//获取网站浏览量
export const getViewCount = () => {
    return http.requestGet('/admin/web_size_info/view_count');
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

//获取图片列表
export const listImages = (page,size,from) => {
    return http.requestGet('/admin/image/list/' +page+ '/' +size+ '?original=' +from);
}
//获取图片列表,用于管理图片
export const listImagesManagement = (page,size,from) => {
    return http.requestGet('/admin/image/list-all/' +page+ '/' +size+ '?original=' +from);
}

//发表文章
export const postArticle = (article) => {
    return http.requestPost('/admin/article', article);
}
//保存草稿
export const saveArticle = (article) => {
    return http.requestPost('/admin/article', article);
}

//获取文章列表
export const listArticles = (pageNum,pageSize,state,keyword,categoryId) => {
    return http.requestGet('/admin/article/list/' +pageNum+ '/' +pageSize+ '?state=' +state
    + '&keyword=' +keyword+ '&categoryId=' +categoryId);
}

//置顶文章
export const topArticle = (articleId) => {
    return http.requestPut('/admin/article/top/' + articleId);
}

//删除文章（改变状态）
export const deleteArticleByState = (articleId) => {
    return http.requestDelete('/admin/article/state/' + articleId);
}
//彻底删除文章
export const deleteArticle = (articleId) => {
    return http.requestDelete('/admin/article/' + articleId);
}

//获取文章
export const getArticleDetail = (articleId) => {
    return http.requestGet('/admin/article/' + articleId);
}

//更新文章
export const updateArticle = (article) => {
    return http.requestPut('/admin/article/' + article.id,article);
}

//获取评论列表
export const listComments = (pageNum,pageSize) => {
    return http.requestGet('/admin/comment/list/'+pageNum+'/'+pageSize);
}

//删除评论
export const deleteComment = (commentId) => {
    return http.requestDelete('/admin/comment/' + commentId);
}

//置顶评论
export const topComment = (commentId) => {
    return http.requestPut('/admin/comment/top/' + commentId);
}

//禁用图片
export const deleteImage = (imageId) => {
    return http.requestDelete('/admin/image/' +imageId);
}
//恢复图片正常
export const getRightImage = (imageId) => {
    return http.requestPut('/admin/image/' +imageId);
}

//添加速记
export const addNote = (notes) => {
    return http.requestPost('/admin/article/note',notes);
}

//获取速记列表
export const listNote = () => {
    return http.requestGet('/admin/article/note/list');
}

//删除速记
export const deleteNote = (noteId) => {
    return http.requestDelete('/admin/article/note/list/' + noteId);
}

export const doLogOut = () => {
    return http.requestGet('/user/logout');
}

export const checkAdmin = () =>{
    return http.requestGet('/user/check_admin')
}

export const initAdmin = (admin) =>{
    return http.requestPost('/user/admin_account',admin)
}