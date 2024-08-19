import React, { useEffect } from 'react'
import axios from 'axios'
export default function LandingPage() {
  useEffect(()=>{
    axios.get('http://localhost:5000/api/hello')
    .then(response=>console.log(response.data))
    .catch(err=>console.error(err))
  }, [])
    return (
    <div>LandingPage</div>
  )
}
