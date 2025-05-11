import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Heart, Share2, Edit, Delete } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getProductDetails } from '../Services/productService';
import Loading from '../Pages/Loading';
import ProductForm from './AddProductForm';
import { deleteProduct, updateProduct } from '../redux/actions/productAction';
import { useDispatch } from 'react-redux';

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedSize, setSelectedSize] = useState('M');

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const productId = searchParams.get("id")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const CATEGORIES = ["Electronics", "Clothing", "Home", "Accessories","Sports"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getProductDetails(productId)
        setProduct(response.product)
      } catch (error) {
        toast.error('Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [productId])

  const products = {
    colors: ["Black", "White", "Navy", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL"],
    features: [
      "100% organic cotton",
      "Ribbed crew neck",
      "Regular fit",
      "Machine washable"
    ],
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      const response = await dispatch(updateProduct({productData,productId}));
      toast.success("Product updated successfully");
      setShowEditForm(false);
      
      const updatedProduct = await getProductDetails(productId);
      setProduct(updatedProduct.product);
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async(pdtId)=>{
    try {
      const response = await dispatch(deleteProduct(pdtId))
      console.log(response,'this is the response')
      if(response.payload.success == true){
        navigate('/')
        toast.success(response.payload.message)
      }else{
        toast.error('Failed to delete the product')
      }
    } catch (error) {
      toast.error('Failed to delete the product')
    }
  }

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 bg-white">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="mb-4">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="lg:w-1/2">
          <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
              <div >
              <button 
                onClick={() => setShowEditForm(true)}
                className="inline-flex items-center px-3 py-2 border mr-2 border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Product
              </button>
              <button 
                onClick={() => handleDeleteProduct(product._id)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Delete className="h-4 w-4 mr-1" />
                Delete Product
              </button>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(products.rating) ? "fill-current" : ""}
                    fill={i < Math.floor(products.rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {products.rating} ({products.reviewCount} reviews)
              </span>
            </div>

            <div className="text-2xl font-bold text-gray-800 mb-4">
              ${product.price}
            </div>

            <p className="text-gray-600 mb-6">
              {product.description}
            </p>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Color: {selectedColor}</h3>
              <div className="flex space-x-2">
                {products.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full ${color === 'Black' ? 'bg-black' :
                        color === 'White' ? 'bg-white border border-gray-300' :
                          color === 'Navy' ? 'bg-blue-900' :
                            'bg-gray-400'
                      } ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Size: {selectedSize}</h3>
                <button className="text-sm text-blue-500 hover:text-blue-700">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {products.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-center rounded-md border ${selectedSize === size
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 text-gray-500 hover:text-gray-700"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-full text-center py-1 text-gray-700"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 text-gray-500 hover:text-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4 mb-6">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center justify-center">
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </button>
              <button className="p-3 rounded-md border border-gray-300 hover:bg-gray-50">
                <Heart size={20} className="text-gray-600" />
              </button>
              <button className="p-3 rounded-md border border-gray-300 hover:bg-gray-50">
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Features</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                {products.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {showEditForm && (
        <ProductForm
          onClose={() => setShowEditForm(false)}
          onSubmit={handleEditProduct}
          categories={CATEGORIES}
          product={product}
          isEditing={true}
        />
      )}
    </>

  );
}