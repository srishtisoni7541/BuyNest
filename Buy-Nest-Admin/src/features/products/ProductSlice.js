import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../API/axios";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/product/allProducts");
      console.log(response.data.allProducts);
      return response.data.allProducts;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    console.log(productData);
    try {
      const formData = new FormData();
      formData.append("title", productData.title);
      formData.append("description", productData.description || "");
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("category", productData.category);
      formData.append("brand", productData.brand || "");

      // ✅ Append subCategory
      formData.append("subCategory", productData.attributes?.subCategory || "");
      formData.append("colors",JSON.stringify(productData.attributes?.colors || []));
      formData.append("sizes",JSON.stringify( productData.attributes?.sizes || []));

      // Append each image if images exist
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((img) => {
          formData.append("images", img);
        });
      }

      const response = await api.post("/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.newProduct;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.description !== undefined)
        formData.append("description", data.description);
      if (data.price !== undefined) formData.append("price", data.price);
      if (data.stock !== undefined) formData.append("stock", data.stock);
      if (data.category) formData.append("category", data.category);

      // Append images if exist
      if (data.images && data.images.length > 0) {
        data.images.forEach((img) => {
          formData.append("images", img);
        });
      }

      const response = await api.post(`/product/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.updatedProduct;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update product"
      );
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/product/delete/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete product"
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.list.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        // Remove deleted product from the list
        state.list = state.list.filter(
          (prod) => prod._id !== action.payload.id
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((prod) =>
          prod._id === action.payload._id ? action.payload : prod
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
