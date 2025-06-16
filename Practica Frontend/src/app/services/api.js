const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL // Change this to match your backend


function jsonToFormData(json, formData = new FormData(), parentKey = '') {
  // Iterate over each key in the JSON object
  Object.keys(json).forEach(key => {
    const value = json[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key; // Handling nested keys

    // If value is an array, loop through the array and append each element
    if (Array.isArray(value) && value.every(item => item instanceof File)) {
      // Handle array of files
      value.forEach((file, index) => {
        formData.append(`${formKey}[]`, file);
      });
    } else if (Array.isArray(value)) {
      console.log(value);
      value.forEach((item, index) => {
        jsonToFormData({ [index]: item }, formData, formKey);
      });
    } else if (value && typeof value === 'object') {
      // If value is an object (excluding arrays), recurse into the object
      jsonToFormData(value, formData, formKey);
    } else {
      // Otherwise, append the key-value pair directly
      formData.append(formKey, value);
    }
  });

  return formData;
}


// Function to handle API requests
const request = async (endpoint, method = 'GET', data = null) => {
  try {
    const options = {
      method,
      headers: { },
      credentials: 'include'
    };

    if (data) {
      if (method === 'POST' || method === 'PUT') {
        console.log(data);
        const formData = jsonToFormData(data);
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        options.body = formData;
        // Do not set Content-Type header for FormData
      }
    }
  

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
   if (!response.ok) {
      console.error(`Error in ${method} ${endpoint}:`, response);
      (response.status != 500 ? () => {window.location.href = '/'; logout() }: () =>  {console.log('Error 500')})();
      const resJson = await response.json();
      return { error: resJson.error };
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error);
    throw error;
  }
};

/* ----------------- API FUNCTIONS ----------------- */
//login
export const login = async (userData) => {
  return await request('auth/login', 'POST', userData);
};

//logout
export const logout = async () => {
  return await request('auth/logout');
};

// Get user department
export const getDepartment = async () => {
  return await request('users/department');
};


// Get user role
export const getRole = async () => {
  return await request('users/role');
};

//get all users
export const getUsers = async () => {
  return await request('users');
};

//get username
export const getUsername = async () => {
  return await request('users/name');
};

//get email
export const getEmail = async () => {
  return await request('users/email');
}

//Update user email
export const updateUserEmail = async (email) => {
  return await request('users/email', 'PUT', { email });
};


///TIC///

export const getEventsByCategory = async (category) => {
  return await request(`events/category/${category}`);
};

export const getEventsByUser = async (categoryId) => {
  return await request(`events/category/${categoryId}/user`);
};

// Get a single event by ID
export const getEventById = async (eventId) => {
  return eventId ? await request(`events/${eventId}`) : {};
};

// Create a new event
export const createEvent = async (eventData) => {
  return await request('events', 'POST', eventData);
};

//update event status
export const updateEventStatus = async (eventId, status) => {
  return await request(`events/${eventId}`, 'PUT', status);
};

// Get all actions for an event
export const getActionsByEvent = async (eventId) => {
  return await request(`actions/${eventId}`);
};

// Create a new action
export const createAction = async (actionData) => {
  return await request('actions', 'POST', actionData);
};

//Get filtered events by category
export const getEventsFiltered = async (categoryId, filters) => {
  return await request(`events/category/${categoryId}/filter?${new URLSearchParams(filters).toString()}`);
};
///TIC//

///OFICINA DE PARTES///
// Get receptions by category
export const getReceptionsByCategory = async (categoryId) => {
  return await request(`receptions/category/${categoryId}`);
};

//get all receptions
export const getReceptions = async () => {
  return await request('receptions');
};

//get reception by id
export const getReceptionById = async (receptionId) => {
  return await request(`receptions/${receptionId}`);
};
//get reception by user and category
export const getReceptionsByUser = async (categoryId) => {
  return await request(`receptions/category/${categoryId}/user`);
};

//get all sended
export const getSended = async () => {
  return await request('sended');
};

//get sended by id
export const getSendedById = async (sendedId) => {
  return await request(`sended/${sendedId}`);
};

//get sended by user and category
export const getSendedByUser = async (categoryId) => {
  return await request(`sended/category/${categoryId}/user`);
};

//get sended by category
export const getSendedByCategory = async (categoryId) => {
  return await request(`sended/category/${categoryId}`);
};

// Create a new reception
export const createReception = async (receptionData) => {
  return await request('receptions', 'POST', receptionData);
};

// Create a new sended
export const createSended = async (sendedData) => {
  return await request('sended', 'POST', sendedData);
};

//get documents by category
export const getDocumentsByCategory = async (categoryId) => {
  return await request(`documents/category/${categoryId}`);
};

// get documents by user and category
export const getDocumentsByUser = async (categoryId) => {
  return await request(`documents/category/${categoryId}/user`);
};




///OFICINA DE PARTES///


// Get all categories
export const getCategories = async () => {
  return await request('categories');
};

//Get all active categories
export const getActiveCategories = async () => {
  return await request('categories/active');
};

// Create a new category
export const createCategory = async (categoryData) => {
  return await request('categories', 'POST', categoryData);
};
// Reorder categories
export const reorderCategories = async (categoryData) => {
  return await request('categories', 'PUT', {categories: categoryData});
};
//disable category
export const deleteCategory = async (categoryId) => {
  return await request(`categories/${categoryId}`, 'DELETE');
};
//activate category
export const activateCategory = async (categoryId) => {
  return await request(`categories/${categoryId}`, 'PUT');
};

// Get attachments for an action
export const getAttachmentsByAction = async (actionId, tableName) => {
  return await request(`attachments/${actionId}/${tableName}`);
};

export const getCalendarEvents = async () => {
  return await request(`calendar`);
}

export const createCalendarEvent = async (eventData) => {
  return await request('calendar', 'POST', eventData);
}

export const removeCalendarEvent = async (eventId) => {
  return await request(`calendar/${eventId}`, 'DELETE');
}