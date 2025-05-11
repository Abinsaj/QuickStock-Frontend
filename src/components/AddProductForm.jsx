import { X } from "lucide-react"
import { useState, useEffect } from "react"

export default function ProductForm({ onClose, onSubmit, categories, product = null, isEditing = false }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: categories[0] || "",
    imageUrl: "",
  })
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (isEditing && product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price ? String(product.price) : "",
        category: product.category || categories[0] || "",
        imageUrl: product.image_url || "",
      })
      
      if (product.image_url && typeof product.image_url === 'string') {
        setImagePreview(product.image_url)
      }
    }
  }, [isEditing, product, categories])

  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "imageUrl" && files && files.length > 0) {
      const file = files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      const maxSize = 2 * 1024 * 1024; 
  
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          imageUrl: "Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.",
        }));
        return;
      }
  
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          imageUrl: "File size must be less than or equal to 3MB.",
        }));
        return;
      }
  
      setErrors((prev) => ({ ...prev, imageUrl: "" }));
      setFormData({ ...formData, imageUrl: file });
  
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
  
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };
  
  
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData,'this si the form data')
    if (validateForm()) {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
  
      if (formData.imageUrl instanceof File) {
        formDataToSend.append('imageUrl', formData.imageUrl); 
      } else if (typeof formData.imageUrl === 'string' && formData.imageUrl) {
        formDataToSend.append('imageUrl', formData.imageUrl);
      }
      
      if (isEditing && product && product.id) {
        formDataToSend.append('id', product.id);
      }

      
  
      onSubmit(formDataToSend);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($) *
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                  Product Image
                </label>

                {imagePreview && (
                <div className="mt-2 mb-3">
                  <img 
                    src={imagePreview} 
                    alt="Product preview" 
                    className="w-full max-h-64 object-contain border border-gray-200 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({...formData, imageUrl: ""});
                    }}
                    className="mt-2 inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <X className="h-3 w-3 mr-1" /> Remove image
                  </button>

                  {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}

                </div>
              )}

                <input
                  type="file"
                  id="imageUrl"
                  name="imageUrl"
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
                
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isEditing ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}