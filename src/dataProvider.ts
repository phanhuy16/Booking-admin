// import { DataProvider, fetchUtils } from 'react-admin';

// const API_URL = 'https://localhost:7225/api';

// interface StoredAuth {
//   accessToken: string;
//   refreshToken: string;
//   userName: string;
//   role: string;
//   userId: number;
// }

// interface RefreshTokenResponse {
//   success: boolean;
//   userName: string;
//   accessToken: string;
//   refreshToken: string;
// }

// // Resource mapping để xử lý các endpoint đặc biệt
// const RESOURCE_CONFIG: Record<string, {
//   getList?: string;
//   getOne?: string;
//   create?: string;
//   update?: string;
//   delete?: string;
//   adminPrefix?: boolean;
// }> = {
//   'doctors': {
//     getList: 'doctors',
//     getOne: 'doctors',
//     create: 'doctors/admin/create-with-user',
//     update: 'doctors/admin',
//     delete: 'doctors/admin',
//   },
//   'patients': {
//     getList: 'patients',
//     getOne: 'patients',
//     create: 'patients/admin',
//     update: 'patients',
//     delete: 'patients/admin',
//   },
//   'bookings': {
//     getList: 'bookings',
//     getOne: 'bookings',
//     create: 'bookings',
//     update: 'bookings',
//     delete: 'bookings',
//   },
//   'medical-records': {
//     getList: 'medical-records/admin',
//     getOne: 'medical-records',
//     create: 'medical-records/doctor',
//     update: 'medical-records',
//     delete: 'medical-records/admin',
//   },
//   'notifications': {
//     getList: 'notifications/my-notifications',
//     getOne: 'notifications',
//     create: 'notifications/admin',
//     update: 'notifications',
//     delete: 'notifications',
//   },
//   'payments': {
//     getList: 'payments/admin',
//     getOne: 'payments/booking',
//     create: 'payments',
//     update: 'payments/admin',
//     delete: 'payments/admin',
//   },
//   'schedules': {
//     getList: 'schedules/admin',
//     getOne: 'schedules',
//     create: 'schedules',
//     update: 'schedules',
//     delete: 'schedules',
//   },
//   'services': {
//     getList: 'services',
//     getOne: 'services',
//     create: 'services/admin',
//     update: 'services/admin',
//     delete: 'services/admin',
//   },
//   'specialties': {
//     getList: 'specialties',
//     getOne: 'specialties',
//     create: 'specialties/admin',
//     update: 'specialties/admin',
//     delete: 'specialties/admin',
//   },
//   'feedbacks': {
//     getList: 'feedbacks',
//     getOne: 'feedbacks',
//     create: 'feedbacks',
//     update: 'feedbacks',
//     delete: 'feedbacks',
//   },
// };

// // Refresh token function
// const refreshAccessToken = async (): Promise<string | null> => {
//   const authString = localStorage.getItem('auth');
//   if (!authString) return null;

//   const auth: StoredAuth = JSON.parse(authString);

//   try {
//     const response = await fetch(`${API_URL}/auth/refresh-token`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ refreshToken: auth.refreshToken })
//     });

//     if (!response.ok) {
//       localStorage.clear();
//       window.location.href = '/#/login';
//       return null;
//     }

//     const data: RefreshTokenResponse = await response.json();

//     if (!data.success) {
//       localStorage.clear();
//       window.location.href = '/#/login';
//       return null;
//     }

//     // Decode JWT để lấy role và userId
//     const base64Url = data.accessToken.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//         .join('')
//     );
//     const payload = JSON.parse(jsonPayload);

//     const newAuth: StoredAuth = {
//       accessToken: data.accessToken,
//       refreshToken: data.refreshToken,
//       userName: data.userName,
//       role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role,
//       userId: parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub)
//     };

//     localStorage.setItem('auth', JSON.stringify(newAuth));
//     return data.accessToken;
//   } catch (error) {
//     console.error('Refresh token failed:', error);
//     localStorage.clear();
//     window.location.href = '/#/login';
//     return null;
//   }
// };

// // Custom httpClient với retry logic
// const httpClient = async (url: string, options: fetchUtils.Options = {}) => {
//   const authString = localStorage.getItem('auth');

//   if (authString) {
//     const auth: StoredAuth = JSON.parse(authString);

//     if (!options.headers) {
//       options.headers = new Headers({ Accept: 'application/json' });
//     }

//     (options.headers as Headers).set('Authorization', `Bearer ${auth.accessToken}`);
//   }

//   try {
//     return await fetchUtils.fetchJson(url, options);
//   } catch (error: any) {
//     // Nếu lỗi 401, thử refresh token và retry
//     if (error.status === 401) {
//       const newToken = await refreshAccessToken();

//       if (newToken && options.headers) {
//         (options.headers as Headers).set('Authorization', `Bearer ${newToken}`);
//         // Retry request với token mới
//         return await fetchUtils.fetchJson(url, options);
//       }
//     }

//     throw error;
//   }
// };

// // Helper function để lấy endpoint path
// const getEndpoint = (resource: string, operation: keyof typeof RESOURCE_CONFIG[string]): string => {
//   const config = RESOURCE_CONFIG[resource];
//   if (config && config[operation]) {
//     return config[operation] as string;
//   }
//   return resource;
// };

// // Custom Data Provider
// const dataProvider: DataProvider = {
//   getList: async (resource, params) => {
//     const { page = 1, perPage = 10 } = params.pagination || {};
//     const { field = 'id', order = 'ASC' } = params.sort || {};

//     const endpoint = getEndpoint(resource, 'getList');

//     // Build query parameters
//     const query = {
//       _sort: field,
//       _order: order,
//       _start: (page - 1) * perPage,
//       _end: page * perPage,
//       ...params.filter,
//     };

//     const url = `${API_URL}/${endpoint}?${new URLSearchParams(query as any).toString()}`;

//     try {
//       const { json, headers } = await httpClient(url);

//       // Xử lý response - có thể là array trực tiếp hoặc object với items
//       let data = json;
//       let total = 0;

//       if (Array.isArray(json)) {
//         data = json;
//         total = json.length;
//       } else if (json.items && Array.isArray(json.items)) {
//         // Trường hợp API trả về { items: [], total: 0 }
//         data = json.items;
//         total = json.total || json.items.length;
//       } else if (json.data && Array.isArray(json.data)) {
//         // Trường hợp API trả về { data: [], total: 0 }
//         data = json.data;
//         total = json.total || json.data.length;
//       }

//       // Nếu có x-total-count header, ưu tiên sử dụng
//       if (headers.has('x-total-count')) {
//         total = parseInt(headers.get('x-total-count') || '0', 10);
//       }

//       return {
//         data: data,
//         total: total,
//       };
//     } catch (error) {
//       console.error(`Error fetching ${resource}:`, error);
//       throw error;
//     }
//   },

//   getOne: async (resource, params) => {
//     const endpoint = getEndpoint(resource, 'getOne');

//     // Special handling for payments (uses booking ID)
//     let url: string;
//     if (resource === 'payments') {
//       url = `${API_URL}/${endpoint}/${params.id}`;
//     } else {
//       url = `${API_URL}/${endpoint}/${params.id}`;
//     }

//     try {
//       const { json } = await httpClient(url);
//       return { data: json };
//     } catch (error) {
//       console.error(`Error fetching ${resource} ${params.id}:`, error);
//       throw error;
//     }
//   },

//   getMany: async (resource, params) => {
//     // Fetch multiple items by IDs
//     const results = await Promise.all(
//       params.ids.map(id =>
//         dataProvider.getOne(resource, { id })
//       )
//     );
//     return { data: results.map(r => r.data) };
//   },

//   getManyReference: async (resource, params) => {
//     const { page = 1, perPage = 10 } = params.pagination || {};
//     const { field = 'id', order = 'ASC' } = params.sort || {};

//     const query = {
//       _sort: field,
//       _order: order,
//       _start: (page - 1) * perPage,
//       _end: page * perPage,
//       [params.target]: params.id,
//       ...params.filter,
//     };

//     const endpoint = getEndpoint(resource, 'getList');
//     const url = `${API_URL}/${endpoint}?${new URLSearchParams(query as any).toString()}`;

//     try {
//       const { json, headers } = await httpClient(url);

//       let data = Array.isArray(json) ? json : (json.items || json.data || []);
//       const total = headers.has('x-total-count')
//         ? parseInt(headers.get('x-total-count') || '0', 10)
//         : data.length;

//       return {
//         data: data,
//         total: total,
//       };
//     } catch (error) {
//       console.error(`Error fetching ${resource} reference:`, error);
//       throw error;
//     }
//   },

//   create: async (resource, params) => {
//     const endpoint = getEndpoint(resource, 'create');
//     const url = `${API_URL}/${endpoint}`;

//     try {
//       // Xử lý FormData cho file uploads (medical-records, specialties)
//       let body: any;
//       let options: fetchUtils.Options = { method: 'POST' };

//       if (params.data instanceof FormData) {
//         body = params.data;
//         // Don't set Content-Type, let browser set it with boundary
//       } else if (resource === 'medical-records' && params.data.attachment) {
//         // Medical records cần FormData
//         const formData = new FormData();
//         Object.keys(params.data).forEach(key => {
//           if (key === 'attachment' && params.data[key]?.rawFile) {
//             formData.append(key, params.data[key].rawFile);
//           } else {
//             formData.append(key, params.data[key]);
//           }
//         });
//         body = formData;
//       } else if (resource === 'specialties' && params.data.icon) {
//         // Specialties cần FormData với field name là "icon"
//         const formData = new FormData();
//         Object.keys(params.data).forEach(key => {
//           if (key === 'icon' && params.data[key]?.rawFile) {
//             formData.append('icon', params.data[key].rawFile);
//           } else if (key !== 'icon') {
//             formData.append(key, params.data[key]);
//           }
//         });
//         body = formData;
//       } else {
//         body = JSON.stringify(params.data);
//         options.headers = new Headers({ 'Content-Type': 'application/json' });
//       }

//       options.body = body;

//       const { json } = await httpClient(url, options);

//       return { data: json };
//     } catch (error) {
//       console.error(`Error creating ${resource}:`, error);
//       throw error;
//     }
//   },

//   update: async (resource, params) => {
//     const endpoint = getEndpoint(resource, 'update');
//     const url = `${API_URL}/${endpoint}/${params.id}`;

//     try {
//       // Transform data based on resource
//       let dataToSend = { ...params.data };

//       // Handle specific transformations
//       if (resource === 'patients' && params.data.gender) {
//         // Convert string gender to enum (0, 1, 2)
//         dataToSend.gender = params.data.gender === 'Male' ? 0 :
//           params.data.gender === 'Female' ? 1 : 2;
//       }

//       // Handle booking status update
//       if (resource === 'bookings' && params.data.status !== undefined) {
//         const statusUrl = `${API_URL}/bookings/${params.id}/status`;
//         const { json } = await httpClient(statusUrl, {
//           method: 'PUT',
//           body: JSON.stringify({ status: params.data.status }),
//           headers: new Headers({ 'Content-Type': 'application/json' }),
//         });
//         return { data: json };
//       }

//       // Handle payment status update
//       if (resource === 'payments' && params.data.status !== undefined) {
//         const statusUrl = `${API_URL}/payments/admin/${params.id}/status`;
//         const { json } = await httpClient(statusUrl, {
//           method: 'PUT',
//           body: JSON.stringify({ status: params.data.status }),
//           headers: new Headers({ 'Content-Type': 'application/json' }),
//         });
//         return { data: json };
//       }

//       // Handle FormData for file updates
//       let body: any;
//       let headers: any = {};

//       if (params.data instanceof FormData) {
//         body = params.data;
//       } else if (resource === 'specialties' && params.data.icon) {
//         const formData = new FormData();
//         Object.keys(dataToSend).forEach(key => {
//           if (key === 'imageFile' && dataToSend[key]?.rawFile) {
//             formData.append(key, dataToSend[key].rawFile);
//           } else {
//             formData.append(key, dataToSend[key]);
//           }
//         });
//         body = formData;
//       } else {
//         body = JSON.stringify(dataToSend);
//         headers['Content-Type'] = 'application/json';
//       }

//       const { json } = await httpClient(url, {
//         method: 'PUT',
//         body: body,
//         ...(Object.keys(headers).length > 0 && { headers })
//       });

//       // Some endpoints return boolean, handle that
//       if (typeof json === 'boolean' || json.message) {
//         return { data: { ...params.data, id: params.id } };
//       }

//       return { data: json };
//     } catch (error) {
//       console.error(`Error updating ${resource} ${params.id}:`, error);
//       throw error;
//     }
//   },

//   updateMany: async (resource, params) => {
//     const responses = await Promise.all(
//       params.ids.map(id =>
//         dataProvider.update(resource, { id, data: params.data, previousData: {} })
//       )
//     );
//     return { data: responses.map(r => r.data.id) };
//   },

//   delete: async (resource, params) => {
//     const endpoint = getEndpoint(resource, 'delete');
//     const url = `${API_URL}/${endpoint}/${params.id}`;

//     try {
//       const { json } = await httpClient(url, {
//         method: 'DELETE',
//       });

//       // Some endpoints return the deleted object, some return success message
//       if (json.id) {
//         return { data: json };
//       } else {
//         return { data: { ...params.previousData, id: params.id } as any };
//       }
//     } catch (error) {
//       console.error(`Error deleting ${resource} ${params.id}:`, error);
//       throw error;
//     }
//   },

//   deleteMany: async (resource, params) => {
//     const responses = await Promise.all(
//       params.ids.map(id =>
//         dataProvider.delete(resource, { id, previousData: { id } as any })
//       )
//     );
//     return { data: responses.map(r => r.data.id) };
//   },
// };

// export default dataProvider;
import { DataProvider, fetchUtils } from 'react-admin';

const API_URL = 'https://localhost:7225/api';

interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  userName: string;
  role: string;
  userId: number;
}

interface RefreshTokenResponse {
  success: boolean;
  userName: string;
  accessToken: string;
  refreshToken: string;
}

// Resource mapping để xử lý các endpoint đặc biệt
const RESOURCE_CONFIG: Record<string, {
  getList?: string;
  getOne?: string;
  create?: string;
  update?: string;
  delete?: string;
  adminPrefix?: boolean;
}> = {
  'doctors': {
    getList: 'doctors',
    getOne: 'doctors',
    create: 'doctors/admin/create-with-user',
    update: 'doctors/admin',
    delete: 'doctors/admin',
  },
  'patients': {
    getList: 'patients',
    getOne: 'patients',
    create: 'patients/admin',
    update: 'patients',
    delete: 'patients/admin',
  },
  'bookings': {
    getList: 'bookings',
    getOne: 'bookings',
    create: 'bookings',
    update: 'bookings',
    delete: 'bookings',
  },
  'medical-records': {
    getList: 'medical-records/admin',
    getOne: 'medical-records',
    create: 'medical-records/doctor',
    update: 'medical-records',
    delete: 'medical-records/admin',
  },
  'notifications': {
    getList: 'notifications/my-notifications',
    getOne: 'notifications',
    create: 'notifications/admin',
    update: 'notifications',
    delete: 'notifications',
  },
  'payments': {
    getList: 'payments/admin',
    getOne: 'payments/booking',
    create: 'payments',
    update: 'payments/admin',
    delete: 'payments/admin',
  },
  'schedules': {
    getList: 'schedules/admin',
    getOne: 'schedules',
    create: 'schedules',
    update: 'schedules',
    delete: 'schedules',
  },
  'services': {
    getList: 'services',
    getOne: 'services',
    create: 'services/admin',
    update: 'services/admin',
    delete: 'services/admin',
  },
  'specialties': {
    getList: 'specialties',
    getOne: 'specialties',
    create: 'specialties/admin',
    update: 'specialties/admin',
    delete: 'specialties/admin',
  },
  'feedbacks': {
    getList: 'feedbacks',
    getOne: 'feedbacks',
    create: 'feedbacks',
    update: 'feedbacks',
    delete: 'feedbacks',
  },
};

// Refresh token function
const refreshAccessToken = async (): Promise<string | null> => {
  const authString = localStorage.getItem('auth');
  if (!authString) return null;

  const auth: StoredAuth = JSON.parse(authString);

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: auth.refreshToken })
    });

    if (!response.ok) {
      localStorage.clear();
      window.location.href = '/#/login';
      return null;
    }

    const data: RefreshTokenResponse = await response.json();

    if (!data.success) {
      localStorage.clear();
      window.location.href = '/#/login';
      return null;
    }

    // Decode JWT để lấy role và userId
    const base64Url = data.accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);

    const newAuth: StoredAuth = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userName: data.userName,
      role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role,
      userId: parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub)
    };

    localStorage.setItem('auth', JSON.stringify(newAuth));
    return data.accessToken;
  } catch (error) {
    console.error('Refresh token failed:', error);
    localStorage.clear();
    window.location.href = '/#/login';
    return null;
  }
};

// Custom httpClient với retry logic
const httpClient = async (url: string, options: fetchUtils.Options = {}) => {
  const authString = localStorage.getItem('auth');

  if (authString) {
    const auth: StoredAuth = JSON.parse(authString);

    if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
    }

    (options.headers as Headers).set('Authorization', `Bearer ${auth.accessToken}`);
  }

  try {
    return await fetchUtils.fetchJson(url, options);
  } catch (error: any) {
    // Nếu lỗi 401, thử refresh token và retry
    if (error.status === 401) {
      const newToken = await refreshAccessToken();

      if (newToken && options.headers) {
        (options.headers as Headers).set('Authorization', `Bearer ${newToken}`);
        // Retry request với token mới
        return await fetchUtils.fetchJson(url, options);
      }
    }

    throw error;
  }
};

// Helper function để lấy endpoint path
const getEndpoint = (resource: string, operation: keyof typeof RESOURCE_CONFIG[string]): string => {
  const config = RESOURCE_CONFIG[resource];
  if (config && config[operation]) {
    return config[operation] as string;
  }
  return resource;
};

// Custom Data Provider
const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field = 'id', order = 'ASC' } = params.sort || {};

    const endpoint = getEndpoint(resource, 'getList');

    // Build query parameters
    const query = {
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
      ...params.filter,
    };

    const url = `${API_URL}/${endpoint}?${new URLSearchParams(query as any).toString()}`;

    try {
      const { json, headers } = await httpClient(url);

      // Xử lý response - có thể là array trực tiếp hoặc object với items
      let data = json;
      let total = 0;

      if (Array.isArray(json)) {
        data = json;
        total = json.length;
      } else if (json.items && Array.isArray(json.items)) {
        // Trường hợp API trả về { items: [], total: 0 }
        data = json.items;
        total = json.total || json.items.length;
      } else if (json.data && Array.isArray(json.data)) {
        // Trường hợp API trả về { data: [], total: 0 }
        data = json.data;
        total = json.total || json.data.length;
      }

      // Nếu có x-total-count header, ưu tiên sử dụng
      if (headers.has('x-total-count')) {
        total = parseInt(headers.get('x-total-count') || '0', 10);
      }

      return {
        data: data,
        total: total,
      };
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      throw error;
    }
  },

  getOne: async (resource, params) => {
    const endpoint = getEndpoint(resource, 'getOne');

    // Special handling for payments (uses booking ID)
    let url: string;
    if (resource === 'payments') {
      url = `${API_URL}/${endpoint}/${params.id}`;
    } else {
      url = `${API_URL}/${endpoint}/${params.id}`;
    }

    try {
      const { json } = await httpClient(url);
      return { data: json };
    } catch (error) {
      console.error(`Error fetching ${resource} ${params.id}:`, error);
      throw error;
    }
  },

  getMany: async (resource, params) => {
    // Fetch multiple items by IDs
    const results = await Promise.all(
      params.ids.map(id =>
        dataProvider.getOne(resource, { id })
      )
    );
    return { data: results.map(r => r.data) };
  },

  getManyReference: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field = 'id', order = 'ASC' } = params.sort || {};

    const query = {
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
      [params.target]: params.id,
      ...params.filter,
    };

    const endpoint = getEndpoint(resource, 'getList');
    const url = `${API_URL}/${endpoint}?${new URLSearchParams(query as any).toString()}`;

    try {
      const { json, headers } = await httpClient(url);

      let data = Array.isArray(json) ? json : (json.items || json.data || []);
      const total = headers.has('x-total-count')
        ? parseInt(headers.get('x-total-count') || '0', 10)
        : data.length;

      return {
        data: data,
        total: total,
      };
    } catch (error) {
      console.error(`Error fetching ${resource} reference:`, error);
      throw error;
    }
  },

  create: async (resource, params) => {
    const endpoint = getEndpoint(resource, 'create');
    const url = `${API_URL}/${endpoint}`;

    try {
      // Xử lý FormData cho file uploads (medical-records, specialties)
      let body: any;
      let options: fetchUtils.Options = { method: 'POST' };

      if (params.data instanceof FormData) {
        body = params.data;
        // Don't set Content-Type, let browser set it with boundary
      } else if (resource === 'medical-records' && params.data.attachment) {
        // Medical records cần FormData
        const formData = new FormData();
        Object.keys(params.data).forEach(key => {
          if (key === 'attachment' && params.data[key]?.rawFile) {
            formData.append(key, params.data[key].rawFile);
          } else {
            formData.append(key, params.data[key]);
          }
        });
        body = formData;
      } else if (resource === 'specialties' && params.data.icon) {
        // Specialties cần FormData với field name là "icon"
        const formData = new FormData();
        Object.keys(params.data).forEach(key => {
          if (key === 'icon' && params.data[key]?.rawFile) {
            formData.append('icon', params.data[key].rawFile);
          } else if (key !== 'icon') {
            formData.append(key, params.data[key]);
          }
        });
        body = formData;
      } else {
        body = JSON.stringify(params.data);
        options.headers = new Headers({ 'Content-Type': 'application/json' });
      }

      options.body = body;

      const { json } = await httpClient(url, options);

      return { data: json };
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      throw error;
    }
  },

  update: async (resource, params) => {
    const endpoint = getEndpoint(resource, 'update');
    const url = `${API_URL}/${endpoint}/${params.id}`;

    try {
      // Transform data based on resource
      let dataToSend = { ...params.data };

      // Handle specific transformations
      if (resource === 'patients' && params.data.gender) {
        // Convert string gender to enum (0, 1, 2)
        dataToSend.gender = params.data.gender === 'Male' ? 0 :
          params.data.gender === 'Female' ? 1 : 2;
      }

      // Handle booking status update
      if (resource === 'bookings' && params.data.status !== undefined) {
        const statusUrl = `${API_URL}/bookings/${params.id}/status`;
        const { json } = await httpClient(statusUrl, {
          method: 'PUT',
          body: JSON.stringify({ status: params.data.status }),
        });
        return { data: json };
      }

      // Handle payment status update
      if (resource === 'payments' && params.data.status !== undefined) {
        const statusUrl = `${API_URL}/payments/admin/${params.id}/status`;
        const { json } = await httpClient(statusUrl, {
          method: 'PUT',
          body: JSON.stringify({ status: params.data.status }),
        });
        return { data: json };
      }

      // Handle FormData for file updates
      let body: any;
      let headers: any = {};

      if (params.data instanceof FormData) {
        body = params.data;
      } else if (resource === 'specialties' && params.data.icon) {
        // Specialties update với icon
        const formData = new FormData();
        Object.keys(dataToSend).forEach(key => {
          if (key === 'icon' && dataToSend[key]?.rawFile) {
            formData.append('icon', dataToSend[key].rawFile);
          } else if (key !== 'icon') {
            formData.append(key, dataToSend[key]);
          }
        });
        body = formData;
      } else {
        body = JSON.stringify(dataToSend);
        headers['Content-Type'] = 'application/json';
      }

      const { json } = await httpClient(url, {
        method: 'PUT',
        body: body,
        ...(Object.keys(headers).length > 0 && { headers })
      });

      // Some endpoints return boolean, handle that
      if (typeof json === 'boolean' || json.message) {
        return { data: { ...params.data, id: params.id } };
      }

      return { data: json };
    } catch (error) {
      console.error(`Error updating ${resource} ${params.id}:`, error);
      throw error;
    }
  },

  updateMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map(id =>
        dataProvider.update(resource, { id, data: params.data, previousData: { id } as any })
      )
    );
    return { data: responses.map(r => r.data.id) };
  },

  delete: async (resource, params) => {
    const endpoint = getEndpoint(resource, 'delete');
    const url = `${API_URL}/${endpoint}/${params.id}`;

    try {
      const { json } = await httpClient(url, {
        method: 'DELETE',
      });

      // Some endpoints return the deleted object, some return success message
      if (json.id) {
        return { data: json };
      } else {
        return { data: { ...params.previousData, id: params.id } as any };
      }
    } catch (error) {
      console.error(`Error deleting ${resource} ${params.id}:`, error);
      throw error;
    }
  },

  deleteMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map(id =>
        dataProvider.delete(resource, { id, previousData: { id } as any })
      )
    );
    return { data: responses.map(r => r.data.id) };
  },
};

export default dataProvider;