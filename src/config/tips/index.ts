/**
 * 提示文本
 */
export default {
  pleaseLogin: '请先登录!',
  succeessFollow: '关注成功!',
  successCancelFollow: '取消关注成功!',
  canNotFollowUserSelf: '不能关注自己!',
  successStarArticle: '收藏帖子成功!',
  successCancelStarArticle: '取消收藏帖子成功!',
  successLikeArticle: '点赞帖子成功!',
  successCancelLikeArticle: '取消点赞帖子成功!',
  errorParams: '参数非法!',
  emptyParams: '未携带参数!',
  pleaseDoNotRepeatLogin: '请勿重复登录!',
  userIsNotFound: '用户不存在!',
  searchPlaceholder: '请输入内容进行搜索',
  notFound: '请求的资源不存在!',
  pleaseEnter: '请先输入内容!',
  allowImage: '只允许图片格式的文件!',
  imageSizeOverflow: '图片大小限制为10MB!',
  pleaseSelectFile: '请选择文件!',
  textAllowSize: (num: number) => `限制文本长度为${ num }个字符!`,
  successLikeComment: '点赞评论成功!',
  successCancelLikeComment: '取消点赞评论成功!',
  commentPlaceholder: '回复该帖子',
  emptyStringWaring: '无效的字符串!',
  successComment: '发送评论成功!',
  successUpload: '上传成功!',
  textNameAllSize: (name: string, max: number, min: number) => `${ name }限制长度为${ min }-${ max }个字符!`,
  textNameNotEmpty: (name: string) => `${ name }不能为空!`,
  usernameHasExist: '用户名已经存在了!',
  successEditUserInfo: '更新用户信息成功!',
  formPlaceholder: (name: string) => `请输入${ name }`,
  passwordNotEqual: '两次密码不一致!',
  successEditPassword: '更新用户密码成功!',
  formNotEmpty: (name: string) => `${ name }不能为空!`,
  pleaseSelectImage: '请选择图片',
  pleaseUploadInTurn: '请依次选择图片!',
  successPostArticle: '发帖成功!',
  pleaseSelectBar: '请选择吧!',
  successCreateBar: '创建吧成功!',
  searchPleaseholder: '请输入内容来搜索',
  successEditBar:'修改吧信息成功!'
}