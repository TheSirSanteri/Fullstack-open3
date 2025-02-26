import axios from 'axios'
const baseUrl = 'https://fullstack-open3-cxjw.onrender.com/api/persons'

const getAll = () => axios.get(baseUrl).then(response => Array.isArray(response.data) ? response.data : []);
getAll().then(data => console.log("Fetched persons:", data));

const create = newObject => axios.post(baseUrl, newObject).then(response => response.data);
const remove = id => {
    console.log("Attempting to delete ID:", id); // Debugging
    if (!id) {
      console.error("Invalid delete request: ID is undefined");
      return Promise.reject("Invalid ID");
    }
    return axios.delete(`${baseUrl}/${id}`).then(() => id);
};

export default { getAll, create, remove };