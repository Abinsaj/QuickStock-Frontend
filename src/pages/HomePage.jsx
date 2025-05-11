import { useState, useEffect } from "react"
import Header from "../components/Header"
import SearchBar from "../components/SearchBar"
import FilterSection from "../components/FilterSection"
import ProductGrid from "../components/ProductGrid"
import Pagination from "../components/Pagination"
import {useDispatch} from 'react-redux'
import { addProduct, getAllProducts } from "../redux/actions/productAction"
import { toast } from "sonner"
import ProductForm from "../components/AddProductForm"


const CATEGORIES = ["Electronics", "Clothing", "Home", "Accessories","Sports"];

export default function ProductCatalog() {
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showProductForm, setShowProductForm] = useState(false)
  const [sortOption, setSortOption] = useState("newest")
  const [editingProduct, setEditingProduct] = useState(null)
  const productsPerPage = 6
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams({
          search: searchTerm,
          category: selectedCategory,
          sort: sortOption,
          page: currentPage,
          limit: productsPerPage,
        })
  
        const data = await dispatch(getAllProducts(queryParams)).unwrap()

        setProducts(data.products)
        setTotalPages(Math.ceil(data.total / productsPerPage))
      } catch (error) {
        console.error("Failed to fetch products", error)
      }
    }
  
    fetchProducts()
  }, [searchTerm, selectedCategory, sortOption, currentPage, showProductForm])
  

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setPriceRange({ min: 0, max: 300 })
  }

  const handleAddProduct = async(newProduct) => {
    try {
      const response = await dispatch(addProduct(newProduct))
      if(response.meta.requestStatus == 'fulfilled'){
          toast.success(response.payload.message)
          setShowProductForm(false)

          const queryParams = new URLSearchParams({
            page: currentPage,
            limit: productsPerPage,
          })
          await dispatch(getAllProducts(queryParams))
      }else{
        toast.error("Failed to add product");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }  
  }

  const handleProductFormSubmit = (productData) => {
    if (editingProduct) {
      handleEditProduct(productData)
    } else {
      handleAddProduct(productData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddProductClick={() => setShowProductForm(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <FilterSection
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onResetFilters={resetFilters}
            />
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Sort by:</span>
            <select
              className="block w-full pl-3 pr-10 py-1 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <ProductGrid
          products={products}
          emptyState={
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button
                onClick={resetFilters}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            </div>
          }
        />

        {products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
            itemsPerPage={productsPerPage}
            totalItems={products.length}
          />
        )}
      </main>

      {showProductForm && (
        <ProductForm 
          onClose={() => {
            setShowProductForm(false)
            setEditingProduct(null)
          }} 
          onSubmit={handleProductFormSubmit} 
          categories={CATEGORIES}
          product={editingProduct}
          isEditing={!!editingProduct}
        />
      )}
    </div>
  )
}
