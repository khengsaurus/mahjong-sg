import axios, { AxiosInstance } from 'axios';
import { Content } from 'enums';
import { isDev, platform } from 'platform';

export class AxiosService {
	private instance: AxiosInstance;
	public serverEndpoint = isDev
		? process.env.REACT_APP_LOCAL_8080
		: process.env.REACT_APP_SERVER_ENDPOINT;

	constructor() {
		const defaultOptions = {
			headers: {
				source: `mj-sg-${platform}`
			}
		};
		this.instance = axios.create(defaultOptions);
	}

	async getContent(key: Content) {
		return new Promise(resolve => {
			try {
				this.instance
					.get(`${this.serverEndpoint}/content/${key}`)
					.then(res => resolve(res.data || null));
			} catch (err) {
				console.info(
					`Failed to fetch resource from ${this.serverEndpoint}: ${err.message}`
				);
				resolve(null);
			}
		});
	}
}

const HttpService = new AxiosService();
export default HttpService;
