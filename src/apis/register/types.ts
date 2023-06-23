
/**
 * 注册时发送的请求体
 */
export interface RegisterBody {
    username: string;
    password: string;
}

/**
 * 注册成功的响应结果
 */
export type RegisterResponse = null