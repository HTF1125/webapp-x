const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export const rurl = (url: string) => {
  console.log(NEXT_PUBLIC_API_URL, process.env.NEXT_PUBLIC_API_URL);
  return new URL(url, NEXT_PUBLIC_API_URL).toString();
}

/**
 * 发送请求的统一处理
 * @param url 请求路径
 * @param params 请求参数
 * @param options fetch发送请求需要的配置
 * @returns Promise
 */
export const fetchData = async (url: string, params: Record<string, any> = {}, options: RequestInit = {}) => {
  // 设置默认配置
  const defaultOptions: any = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = localStorage.getItem("access_token");
  if (token) {
    defaultOptions.headers['Authorization'] = 'Bearer ' + token;
  }


  // 合并用户传入的配置
  const newOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  // 处理 GET 请求的参数拼接
  if (newOptions.method.toUpperCase() === 'GET' && params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url += (url.includes('?') ? '&' : '?') + queryString;
  }

  // 处理非 GET 请求的 body 参数
  if (newOptions.method.toUpperCase() !== 'GET' && params && newOptions.headers['Content-Type'] === 'application/json') {
    newOptions.body = JSON.stringify(params);
  }

  const response = await fetch(url, newOptions);
  if (!response.ok) {
    const errorData = await resoveResponse(response);
    throw new Error(errorData?.message || 'Request failed. Please try again.');
  }

  return resoveResponse(response);
}

function resoveResponse(response: Response) {
  const contentType = (response.headers.get('Content-Type') ?? '').split(';')[0].toLowerCase();
  if (contentType?.includes('application/json')) {
    return response.json();
  } else if (contentType?.includes('text/')) {
    return response.text();
  } else if (contentType?.includes('application/octet-stream')) {
    return response.blob();
  } else {
    return response;
  }
}
