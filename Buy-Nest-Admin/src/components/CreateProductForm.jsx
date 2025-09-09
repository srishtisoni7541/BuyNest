import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Save, Loader2 } from "lucide-react";
import FileUpload from "./FileUpload";
import FormContainer from "./FormContainer";
import FormField from "./FormField";
import { fetchCategories } from "../features/categories/CategorySlice";
import toast from "react-hot-toast";
import { createProduct } from "../features/products/ProductSlice";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const { list: categories, loading: catLoading } = useSelector(
    (state) => state.categories
  );
  const { loading: productLoading } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "",
    stock: 0,
    category: "",
    brand: "",
    sale: false,
    images: [],
    attributes: {
      subCategory: "",
      colors: [],
      sizes: [],
    },
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "subCategory") {
      setFormData((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, subCategory: value },
      }));
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (files) => {
    setFormData({ ...formData, images: files });
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [name]: value ? value.split(",").map((v) => v.trim()) : [],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      await dispatch(createProduct(formData)).unwrap();
      toast.success("Product created successfully!");
      setFormData({
        title: "",
        description: "",
        price: "",
        originalPrice: "",
        discount: "",
        stock: 0,
        category: "",
        brand: "",
        sale: false,
        images: [],
        attributes: { subCategory: "", colors: [], sizes: [] },
      });
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };

  return (
    <FormContainer title="Create New Product">
      {productLoading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
            <p className="text-gray-700 font-medium">Creating Product...</p>
          </div>
        </div>
      )}

      <FormField
        label="Product Name"
        placeholder="Enter product name"
        name="title"
        value={formData.title}
        onChange={handleChange}
      />

      <FormField
        label="Brand"
        placeholder="Enter brand"
        name="brand"
        value={formData.brand}
        onChange={handleChange}
      />

      <FormField
        label="Category"
        type="select"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={
          catLoading
            ? ["Loading..."]
            : ["Select Category", ...categories.map((cat) => cat.name)]
        }
      />

      <FormField
        label="Sub-Category"
        type="select"
        name="subCategory"
        value={formData.attributes?.subCategory}
        onChange={handleChange}
        options={["Select", "Men", "Women", "Kids"]}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Price"
          placeholder="$0.00"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        <FormField
          label="Original Price"
          placeholder="$0.00"
          name="originalPrice"
          value={formData.originalPrice}
          onChange={handleChange}
        />
        <FormField
          label="Discount (%)"
          placeholder="0"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
        />
        <FormField
          label="Stock"
          type="number"
          placeholder="0"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
        />
      </div>

      <FormField
        label="Colors (comma separated)"
        name="colors"
        placeholder="Red, Blue, Green"
        value={(formData.attributes.colors || []).join(", ")}
        onChange={handleArrayChange}
      />

      <FormField
        label="Sizes (comma separated)"
        name="sizes"
        placeholder="S, M, L, XL"
        value={formData.attributes?.sizes.join(", ")}
        onChange={handleArrayChange}
      />

      <FormField
        label="Description"
        type="textarea"
        rows={4}
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <FormField
        label="Sale"
        type="checkbox"
        name="sale"
        checked={formData.sale}
        onChange={handleChange}
      />

      <FileUpload label="Product Images" onFilesSelected={handleFileChange} />

      <button
        onClick={handleSubmit}
        className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
      >
        {productLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Creating...</span>
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            <span>Create Product</span>
          </>
        )}
      </button>
    </FormContainer>
  );
};

export default CreateProduct;
