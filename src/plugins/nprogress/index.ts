import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false });

/**
 * 开始进度条
 */
export function star () {
  NProgress.start()
}
/**
 * 结束进度条
 */
export function end () {
  NProgress.done()
}
