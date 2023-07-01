import directives from "@/directives";
import type { App } from "vue";

export default function (app: App) {
    Object.entries(directives).forEach(([key, value]) => {
        app.directive(key, value)
    })
}