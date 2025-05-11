import axiosInstance from '../config/axiosInstance'

export const addProductService = async(productData)=>{
    try {
        const response = await axiosInstance.post(`/api/products`,productData);
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchAllProducts = async(queryParams)=>{
    try {
        const response = await axiosInstance.get(`/api/products?${queryParams}`)
        return response.data
    } catch (error) {
        throw error;
    }
}

export const getProductDetails = async(productId)=>{
    try {
        const response = await axiosInstance.get(`/api/products/${productId}`);
        console.log(response, 'this is the response we got here');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateProductData = async(productData,productId)=>{
    try {
        const response = await axiosInstance.put(`/api/products/${productId}`,productData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteProductSerivce = async(productId)=>{
    try {
        const response = await axiosInstance.delete(`/api/products/${productId}`)
        return response.data
    } catch (error) {
        throw error
    }
}