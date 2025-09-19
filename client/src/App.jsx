import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import BlogTitle from './pages/BlogTitle'
import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import RemoveObject from './pages/RemoveObject'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const App = () => {

  
  return (
    <>
    <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />} >
<Route index element={<Dashboard />} />
<Route path='write-article' element={<WriteArticle />} />
<Route path='blog-title' element={<BlogTitle />} />
<Route path='generate-images' element={<GenerateImages />} />
<Route path='remove-background' element={<RemoveBackground />} />
<Route path='remove-object' element={<RemoveObject />} />
<Route path='review-resume' element={<ReviewResume />} />
<Route path='community' element={<Community />} />
        </Route>
      </Routes>
    </>
  )
}

export default App