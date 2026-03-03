import {AUTH_TOKEN_KEY} from '@/constants';
import {refreshTokenRequest} from '../helpers';
import {apiClient} from './axios';

export const authInterceptor = async () => {
  // Creating a variable for handling multiple requests
  let isRefreshing = false;
  let failedQueue: {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
  }[] = [];

  // Created a processQueue fun for handling the multiple 401 request
  const processQueue = (error: any, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  const requestInterceptor = apiClient.interceptors.request.use(
    async config => {
      const access_token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (access_token) {
        // Added the access token to the headers
        config.headers.Authorization = `Bearer ${access_token}`;
      }
      return config;
    },
    error => Promise.reject(error),
  );

  const responseInterceptor = apiClient.interceptors.response.use(
    // This function is triggered by any status code within the 2xx range
    response => response,
    async error => {
      const prevRequest = error?.config;
      if (error?.response?.status === 401 && !prevRequest?._retry) {
        /*
         * When response code is 401, try to refresh the token.
         * Eject the interceptor so it doesn't loop in case
         * token refresh causes the 401 response.
         * Must be re-attached later on or the token refresh will only happen once
         */
        apiClient.interceptors.request.eject(requestInterceptor);
        apiClient.interceptors.response.eject(responseInterceptor);
        apiClient.interceptors.request.clear();
        apiClient.interceptors.response.clear();

        // Handle multiple 401 requests
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            //  The 401 request has been added to the failedQueue array
            failedQueue.push({resolve, reject});
          }) //Handle the previous 401 request with an updated access token
            .then(newAccessToken => {
              // In the headers, set the new updated access token
              prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              // Preserve the original request data (including form data for PATCH requests)
              const retryRequest = {
                ...prevRequest,
                data: prevRequest.data, // Preserve original data/formData
                headers: {
                  ...prevRequest.headers,
                  Authorization: `Bearer ${newAccessToken}`,
                },
              };
              return apiClient(retryRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }
        prevRequest._retry = true;
        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            // Using the '/oauth/token/' API, get an updated access token
            const newAccessToken = await refreshTokenRequest();
            if (typeof newAccessToken !== 'undefined') {
              // In the previous header request, set the new updated access token
              apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

              // Preserve the original request data (including form data for PATCH requests)
              const retryRequest = {
                ...prevRequest,
                data: prevRequest.data, // Preserve original data/formData
                headers: {
                  ...prevRequest.headers,
                  Authorization: `Bearer ${newAccessToken}`,
                },
              };

              // Called/resolved the 401 promise request with new access token
              processQueue(null, newAccessToken);
              //resolved the 401 promise request
              resolve(apiClient(retryRequest));
            }
          } catch (err) {
            // reject the last 401 promise request with null value
            processQueue(err, null);
            reject(err);
          } finally {
            isRefreshing = false;
          }
        });
      }
      return Promise.reject(error);
    },
  );
  return {apiClient, requestInterceptor, responseInterceptor};
};
