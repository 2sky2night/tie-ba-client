export default class Token {
    /**
     * 设置token
     * @param value token值
     */
    static setToken(value:string) {
        localStorage.setItem('token',value)
    }
    /**
     * 读取token
     * @returns 
     */
    static getToken() {
        return localStorage.getItem('token')
    }
    /**
     * 移除token
     */
    static removeToken() {
        localStorage.removeItem('token')
    }
}