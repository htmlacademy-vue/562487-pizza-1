import axios from "axios";

const NO_AUTH_STATUS = 401;

const axiosInstance = axios.create({
  baseURL: "/api",
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (e) => {
    if (e?.response?.status === NO_AUTH_STATUS) {
      axiosInstance.$notifier.error("Выполните вход в приложение!");
    } else {
      const defaultMessage = "Возникла ошибка при выполнении запроса к серверу";
      axiosInstance.$notifier.error(
        e?.response?.data?.error?.message || defaultMessage
      );
    }

    return Promise.reject(e);
  }
);

export default axiosInstance;
