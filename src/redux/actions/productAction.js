import { createAsyncThunk } from "@reduxjs/toolkit";
import { addProductService, deleteProductSerivce, fetchAllProducts, updateProductData } from "../../Services/productService";


export const addProduct = createAsyncThunk(
    'product/create',
    async(newProduct, {rejectWithValue})=>{
        try {
            return await addProductService(newProduct)
        } catch (error) {
            return rejectWithValue(error.message || "Failed to add new product");
        }
    }
)

export const getAllProducts = createAsyncThunk(
    'product/allProducts',
    async(filterValue,{rejectWithValue})=>{
        try {
            let data = await fetchAllProducts(filterValue)
            return data
        } catch (error) {

            return rejectWithValue(error.message || "Failed to get product");
        }
    }
)

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async({productData,productId}, {rejectWithValue})=>{
        try {
            return await updateProductData(productData,productId)
        } catch (error) {
            return rejectWithValue(error.message || "Failed to update product");
        }
    }
)

export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async(pdtId, {rejectWithValue})=>{
        try {
            return await deleteProductSerivce(pdtId)
        } catch (error) {
            return rejectWithValue(error.message || "Failed to delete product");
        }
    }
)