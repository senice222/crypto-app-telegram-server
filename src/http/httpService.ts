import axios, { AxiosInstance } from "axios";

class HttpService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.CRYPTO_CLOUD_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      //   validateStatus: function (status: number) {
      //     return (
      //       status === 404 ||
      //       status === 200 ||
      //       status === 201 ||
      //       status === 101 ||
      //       status === 400 ||
      //       status < 200
      //     );
      //   },
    });
  }

  public get instance() {
    return this.axiosInstance;
  }
}

export default new HttpService().instance;
