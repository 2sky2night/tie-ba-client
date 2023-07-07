import { useRouter } from 'vue-router';
/**
 * 路由导航钩子
 * @returns 
 */
export default function () {
  const router = useRouter()

  function goHome () {
    router.push('/')
  }

  function goDiscover () {
    router.push('/discover')
  }

  function goMy () {
    router.push('/my')
  }

  function goUser (uid: number) {
    router.push(`/user/${uid}`)
  }

  function goLogin () {
    router.push('/login')
  }

  function goRegister () {
    router.push('/register')
  }

  function goEdit() {
    router.push('/edit')
  }

  function goArticle(aid: number) {
    router.push(`/article/${aid}`)
  }

  function goBar(bid: number) {
    router.push(`/bar/${bid}`)
  }

  function goFans(uid: number) {
    router.push(`/fans/${uid}`)
  }

  function goFollow(uid: number) {
    router.push(`/follow/${uid}`)
  }

  return {
    goHome,
    goDiscover,
    goMy,
    goUser,
    goLogin,
    goRegister,
    goEdit,
    goArticle,
    goBar,
    goFans,
    goFollow
  }

}