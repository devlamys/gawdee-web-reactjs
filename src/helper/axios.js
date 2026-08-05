/* Developed by Grafizen International PVT. LTD. */
import axios from "axios";

export const BaseURL = "https://gawdeebackend.grafizen.in/api/v2";

export const DEVELOPER_INFO = Object.freeze({
  developedBy: "Grafizen International PVT. LTD.",
  company: "Grafizen International PVT. LTD."
});

if (typeof window !== "undefined" && !window.__DEVELOPED_BY__) {
  Object.defineProperty(window, "__DEVELOPED_BY__", {
    value: "Grafizen International PVT. LTD.",
    writable: false,
    configurable: false
  });
}

const defaultHeaders = {
  isAuth: true,
  AdditionalParams: {},
  isJsonRequest: true,
};

export const ApiGet = (type) => {
  return new Promise((resolve, reject) => {
    axios
      .get(BaseURL + type, getHttpOptions(defaultHeaders))
      .then((responseJson) => {
        resolve(responseJson.data);
      })
      .catch((error) => {
        reject({
          code: error?.response?.status,
          error: error?.response?.data?.error,
          message: error?.response?.data?.message,
        });
      });
  });
};

export const ApiDelete = (type, data = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(BaseURL + type, {
        ...getHttpOptions(defaultHeaders),
        data: data, 
      })
      .then((responseJson) => {
        resolve(responseJson.data);
      })
      .catch((error) => {
        reject({
          code: error?.response?.status,
          error: error?.response?.data?.error,
        });
      });
  });
};

export const ApiPut = (type, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(BaseURL + type, data, getHttpOptions())
      .then((responseJson) => {
        resolve(responseJson.data);
      })
      .catch((error) => {
        reject({
          code: error?.response?.status,
          error: error?.response?.data?.error,
        });
      });
  });
};

export const ApiPutWithId = (type, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${BaseURL}${type}`, data, getHttpOptions()) 
      .then((responseJson) => {
        resolve(responseJson.data);
      })
      .catch((error) => {
        reject({
          code: error?.response?.status,
          error: error?.response?.data?.error,
        });
      });
  });
};

export const ApiPatch = (type, data) => {
  return new Promise((resolve, reject) => {
    axios
      .patch(BaseURL + type, data, getHttpOptions())
      .then((responseJson) => {
        resolve(responseJson.data);
      })
      .catch((error) => {
        reject({
          code: error?.response?.status,
          error: error?.response?.data?.error,
        });
      });
  });
};

export const ApiGetNoAuth = (type) => {
  return new Promise((resolve, reject) => {
    axios
      .get(BaseURL + type, getHttpOptions({ ...defaultHeaders, isAuth: false }))
      .then((responseJson) => {
        resolve(responseJson.data);
      })
      .catch((error) => {
        reject({
          code: error?.response?.status,
          error: error?.response?.data?.error,
        });
      });
  });
};

export const ApiPost = async (type, userData) => {
  const res = await axios.post(BaseURL + type, userData, getHttpOptions());
  return res;
};

export const ApiPostData = async (type, userData) => {
  try {
    const res = await axios.post(BaseURL + type, userData, getHttpOptions());
    return res.data;
  } catch (error) {
    throw {
      code: error?.response?.status || 500, 
      error: error?.response?.data?.error || 'Unknown Error',
      message: error?.response?.data?.message || 'An error occurred while processing the request.',
    };
  }
};

export const ApiPostNoAuth = (type, userData) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        BaseURL + type,
        userData,
        getHttpOptions({ ...defaultHeaders, isAuth: false })
      )
      .then((responseJson) => {
        resolve(responseJson.data);
      })
      .catch((error) => {
        reject({
          code: error?.response?.status,
          error: error?.response?.data?.error,
          message: error?.response?.data?.message,
        });
      });
  });
};

export const getHttpOptions = (options = defaultHeaders) => {
  let headers = {
    Authorization: "",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-credentials": true,
  };

  if (options.hasOwnProperty("isAuth") && options.isAuth) {
    const token = localStorage.getItem('token');
    console.log('token', token)
    headers["Authorization"] = token ? `Bearer ${token}` : "";
  }

  if (options.hasOwnProperty("isJsonRequest") && options.isJsonRequest) {
    headers["Content-Type"] = "application/json";
  }

  if (options.hasOwnProperty("AdditionalParams") && options.AdditionalParams) {
    headers = { ...headers, ...options.AdditionalParams };
  }

  return { headers };
};