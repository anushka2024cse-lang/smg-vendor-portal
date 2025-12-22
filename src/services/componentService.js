import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/components';

const getComponents = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const getComponent = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

const createComponent = async (componentData) => {
    const response = await axios.post(API_URL, componentData);
    return response.data;
};

const updateComponent = async (id, componentData) => {
    const response = await axios.put(`${API_URL}/${id}`, componentData);
    return response.data;
};

const deleteComponent = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

const componentService = {
    getComponents,
    getComponent,
    createComponent,
    updateComponent,
    deleteComponent
};

export default componentService;
