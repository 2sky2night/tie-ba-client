/**
 * 该时间字符串为UTC时间
 * 传入时间类型的字符串 返回相距时间 若超过1天 显示对应日月 超过一年显示日月年
 * @param value 
 * @returns 
 */
export const formatDBDateTime = (value: string) => {
    // 根据字符串生成时间
    const time = new Date(value)
    // 获取相差秒
    const temp = (Date.now() - (time.getTime())) / 1000
    
    if (temp < 60) {
        // 小于分钟
        return `${ temp.toFixed() }秒前`
    }
    if (temp < 60 * 60) {
        // 小于小时
        return `${ (temp / 60).toFixed() }分钟前`
    }
    if (temp < 60 * 60 * 24) {
        // 小于一天
        return `${ (temp / 60 / 60).toFixed() }小时前`
    }
    if (temp < 60 * 60 * 24 * 365) {
        // 超过一天 但不超过一年 返回MM:DD
        return `${ time.getMonth() + 1 }-${ time.getDate() }`
    }
    return time.toLocaleDateString().replace('/', '-').replace('/', '-')
}

/**
 * 获取当前时间与传入时间相距多少天
 * @param value 
 * @returns 
 */
export const getTempDays = (value: string) => {
    const time = (Date.now() - (new Date(value).getTime())) / 1000
    if (time < 60 * 60 * 24) {
        return '0天'
    }
    return `${ (time / 60 / 60 / 24).toFixed() }天`
}

/**
 * 检查一个字符串是否可以被转换成数字,可以就返回数字
 * @param value 
 * @returns 
 */
export const formatNumber = (value: string) => {
    const temp = +value
    if (isNaN(temp)) {
        return false
    } else {
        return temp
    }
}

/**
 * 格式化时间字符串 YYYY年MM月DD日 MM:SS
 * @param value 
 * @returns 
 */
export const getDBDateString = (value: string) => {
    const time = new Date(value)
    return `${ time.getFullYear() }年${ formatDubouleNumber(time.getMonth() + 1) }月${ formatDubouleNumber(time.getDate()) }日 ${ formatDubouleNumber(time.getHours()) }:${ formatDubouleNumber(time.getMinutes()) }`
}

/**
 * 格式化数字为 XX
 * @param value 
 * @returns 
 */
const formatDubouleNumber =  (value: number) => {
    if (value >= 10) {
        return value
    } else {
        return `0${value}`
    }
}

/**
 * 格式化数字为
 * k
 * w
 * kw
 * @param value 
 */
export const formatCount = (value: number)=>{
    if (value < 1000) {
        return value
    } else if (value >= 1000 && value < 10000) {
        return `${(value/1000).toFixed(1)}k`
    } else if(value>=10000&&value<10000*1000){
        return `${(value/10000).toFixed(1)}w`
    } else {
        return `${(value/(10000*1000)).toFixed(1)}kw`
    }
}