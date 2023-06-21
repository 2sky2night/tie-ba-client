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

  function goUser () {
    router.push('/user')
  }

  return {
    goHome,
    goDiscover,
    goMy,
    goUser
  }

}