import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { Heart } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()

  const fetchCreations = async () => {
    try {
      setLoading(true)

      const { data } = await axios.get('/api/user/get-publish-creations', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })

      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        '/api/user/toggle-like-creation',
        { id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      )

      if (data.success) {
        toast.success(data.message)
        await fetchCreations()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  return !loading ? (
    <div className="flex-1 h-full flex-col gap-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Creations</h2>

      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll p-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {creations.map((creation) => (
          <div key={creation._id} className="relative group">
            <img
              src={creation.content}
              alt="creation"
              className="w-full h-full object-cover rounded-lg"
            />

            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white rounded-lg opacity-0 group-hover:opacity-100 transition">
              {/* Prompt text */}
              <p className="text-sm mb-2 line-clamp-2">{creation.prompt}</p>

              {/* Likes */}
              <div className="flex gap-1 items-center">
                <p>{creation.likes.length}</p>
                <Heart
                  onClick={() => imageLikeToggle(creation._id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer transition ${
                    creation.likes.includes(user.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-white'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
     <span className='w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community
