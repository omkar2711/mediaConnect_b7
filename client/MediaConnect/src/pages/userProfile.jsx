import { useEffect, useMemo, useState } from 'react'
import { getProfile, getUserPosts } from '../api/api'

const fallbackProfile = {
  username: 'mediaconnect',
  email: 'you@mediaconnect.app',
  profile: {
    firstName: 'Media',
    lastName: 'Creator',
    bio: 'Crafting stories with pixels and people.',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  followerCount: 2840,
  followingCount: 312,
}

function UserProfile() {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [userData, postData] = await Promise.all([getProfile(), getUserPosts()])
        if (mounted) {
          setProfile(userData)
          setPosts(Array.isArray(postData) ? postData : [])
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load your profile')
      } finally {
        if (mounted) setStatus('done')
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const user = useMemo(() => profile || fallbackProfile, [profile])

  return (
    <div className="profile-page">
      {status === 'loading' && <div className="status-chip">Loading your profile…</div>}
      {error && <div className="status-chip error">{error}</div>}

      <div className="profile-hero">
        <div className="avatar xl">
          <img src={user?.profile?.avatar} alt={user?.username} />
        </div>
        <div className="profile-meta">
          <div className="row">
            <h2>{user?.username}</h2>
            <button className="ghost small">Edit profile</button>
            <button className="primary">Share</button>
          </div>
          <div className="counts">
            <span>
              <strong>{posts.length || 0}</strong> posts
            </span>
            <span>
              <strong>{user?.followerCount ?? 0}</strong> followers
            </span>
            <span>
              <strong>{user?.followingCount ?? 0}</strong> following
            </span>
          </div>
          <div className="identity">
            <p className="name">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </p>
            <p className="muted">{user?.email}</p>
            <p className="bio">{user?.profile?.bio}</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <h3>My Posts</h3>
        {posts.length ? (
          <div className="media-grid">
            {posts.map((post) => (
              <div key={post._id} className="media-tile">
                {Array.isArray(post.media) && post.media[0] ? (
                  <img src={post.media[0]} alt={post.caption || 'Post'} />
                ) : (
                  <div className="placeholder">No media</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">No posts yet. Share something new!</div>
        )}
      </div>
    </div>
  )
}

export default UserProfile

