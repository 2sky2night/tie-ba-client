import { defineStore } from 'pinia'
import { ref } from 'vue'
import { darkTheme } from 'naive-ui'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import { darkCSSVarList, lightCSSVarList } from './configs'

const useThemeStore = defineStore(
    'theme',
    () => {
        // 深色主题样式
        const theme = ref<undefined | BuiltInGlobalTheme>(undefined)
        // 是否为深色主题
        const isDark = ref(false)
        // html标签
        const htmlEle = document.documentElement


        /**
         * 切换主题
         */
        const toToggleTheme = () => {
            if (isDark.value) {
                // 当前为深色 切换为浅色
                theme.value = undefined
                setLightCSSVar()
            } else {
                // 当前为浅色 切换为深色
                theme.value = darkTheme
                setDarkCSSVar()
            }
            isDark.value = !isDark.value
        }

        /**
         * 设置浅色css变量
         */
        const setLightCSSVar = () => {
            Object.entries(lightCSSVarList).forEach(([key, value]) => {
                htmlEle.style.setProperty(key, value)
            })
        }

        /**
         * 设置深色css变量
         */
        const setDarkCSSVar = () => {
            Object.entries(darkCSSVarList).forEach(([key, value]) => {
                htmlEle.style.setProperty(key, value)
            })
        }

        /**
         * 设置为深色主题
         */
        const setDarkTheme = () => {
            theme.value = darkTheme
            setDarkCSSVar()
        }

        return {
            theme,
            isDark,
            toToggleTheme,
            setDarkTheme,
            setLightCSSVar,
            setDarkCSSVar
        }
    },
    {
        persist: {
            paths: ['isDark'],
        }
    }
)

export default useThemeStore