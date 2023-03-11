import axios, { AxiosInstance } from 'axios';
import { Content } from 'enums';
import { isDev } from 'platform';
import FBService from './MyFirebaseService';

export class AxiosService {
	private instance: AxiosInstance;
	private cmsUrl: string;

	constructor() {
		const defaultOptions = {
			headers: { source: 'mj-sg-web' }
		};
		this.instance = axios.create(defaultOptions);
	}

	async initCmsUrl(): Promise<void> {
		return new Promise(resolve => {
			if (this.cmsUrl) {
				resolve();
				return;
			}
			if (isDev) {
				this.cmsUrl = process.env.REACT_APP_LOCAL_8080;
				resolve();
			} else {
				FBService.readCms()
					.then(res => {
						this.cmsUrl = res.data()?.url || '';
						resolve();
					})
					.catch(console.error);
			}
		});
	}

	async getContent(key: Content) {
		if (!this.cmsUrl) await this.initCmsUrl();
		return new Promise(resolve => {
			if (!this.cmsUrl) {
				resolve(null);
				return;
			}
			this.instance
				.get(`${this.cmsUrl}/mj/${key}`)
				.then(res => resolve(res.data || null))
				.catch(err => {
					console.info(
						`Failed to fetch resource from ${this.cmsUrl}: ${err?.message}`
					);
					resolve(null);
				});
		});
	}
}

const axiosServiceInstance = new AxiosService();
export default axiosServiceInstance;
