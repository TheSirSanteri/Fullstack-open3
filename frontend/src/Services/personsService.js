import axios from 'axios'
const baseUrl = 'https://fullstack-open3-cxjw.onrender.com/api/persons'

const getAll = () => axios.get(baseUrl).then(response => Array.isArray(response.data) ? response.data : []);
const create = newObject => axios.post(baseUrl, newObject).then(response => response.data);
const remove = id => {
    if (!id) {
      console.error("Invalid delete request: ID is undefined");
      return Promise.reject("Invalid ID");
    }
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data);
  };

export default { getAll, create, remove };