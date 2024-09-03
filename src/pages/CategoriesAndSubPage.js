import React from 'react'
import AddCategories from '../components/AddCategories'
import CategoriesAndSubCategoriesList from '../components/CategoriesAndSubCategoriestList'

const CategoriesAndSubPage = () => {
  return (
    <div className="container mx-auto px-4 py-24 w-full">
        <AddCategories/>
        <CategoriesAndSubCategoriesList/>
    </div>
  )
}

export default CategoriesAndSubPage