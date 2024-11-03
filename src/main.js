import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import './styles/common.scss'
import './styles/index.scss'
import dayjs from "dayjs";
export function createApp() {
	const app = createSSRApp(App);
	app.provide('$dayjs', dayjs)
	return {
		app,
	};
}
