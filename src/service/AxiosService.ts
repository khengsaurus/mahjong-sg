import axios, { AxiosInstance } from 'axios';
import { Content } from 'enums';
import { isDev } from 'platform';
import FBService from './MyFirebaseService';

interface WebsiteData {
	host: string;
	url: string;
}

export class AxiosService {
	private instance: AxiosInstance;
	private cmsUrl: string;
	private websiteData: Partial<WebsiteData>;

	constructor() {
		const defaultOptions = {
			headers: { source: 'mj-sg-web' }
		};
		this.instance = axios.create(defaultOptions);
	}

	async initCmsUrl() {
		if (this.cmsUrl) return Promise.resolve();

		if (isDev) {
			this.cmsUrl = process.env.REACT_APP_LOCAL_8080;
			return Promise.resolve();
		}

		return FBService.readCms()
			.then(res => (this.cmsUrl = res.data()?.url || ''))
			.catch(console.error);
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

	async getWebsiteUrl(): Promise<Partial<WebsiteData>> {
		if (this.websiteData) return Promise.resolve(this.websiteData);

		return FBService.readWebsite()
			.then(res => {
				const data: Partial<WebsiteData> = res.data() || {};
				this.websiteData = data;
				return data;
			})
			.catch(err => {
				console.error(err);
				return this.websiteData || {};
			});
	}
}

const axiosServiceInstance = new AxiosService();
export default axiosServiceInstance;
