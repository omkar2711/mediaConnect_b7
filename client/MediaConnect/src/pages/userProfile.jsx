import { useEffect, useMemo, useState } from 'react'
import { getProfile, getUserPosts } from '../api/api'

const fallbackProfile = {
  username: 'mediaconnect',
  profile: {
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  followerCount: 0,
  followingCount: 0,
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

  const avatar =
    user?.profile?.avatar || fallbackProfile.profile.avatar

  const formattedPosts = useMemo(() => {
    if (!Array.isArray(posts) || !posts.length) return []
    return posts.map((post, idx) => {
      const media = Array.isArray(post.media) && post.media.length ? post.media[0] : null
      return {
        id: post._id || post.id || idx,
        media,
        likeCount: post.likeCount ?? 0,
        commentCount: Array.isArray(post.comments) ? post.comments.length : 0,
      }
    })
  }, [posts])

  return (
    <div className="ig-profile-page">
      {status === 'loading' && <div className="ig-loading">Loading profile…</div>}
      {error && <div className="ig-error">{error}</div>}

      <header className="ig-profile-header">
        <div className="ig-profile-avatar">
          <img src={avatar} alt={user?.username} />
        </div>
        <div className="ig-profile-info">
          <div className="ig-profile-username-row">
            <h1>{user?.username}</h1>
            <button className="ig-edit-btn">Edit profile</button>
          </div>
          <div className="ig-profile-stats">
            <span><strong>{formattedPosts.length}</strong> posts</span>
            <span><strong>{user?.followerCount ?? 0}</strong> followers</span>
            <span><strong>{user?.followingCount ?? 0}</strong> following</span>
          </div>
        </div>
      </header>

      <div className="ig-profile-posts">
        {formattedPosts.length > 0 ? (
          <div className="ig-profile-grid">
            {formattedPosts.map((post) => (
              <div key={post.id} className="ig-profile-post">
                {post.media ? (
                  <img src={post.media} alt="Post" />
                ) : (
                  <div className="ig-profile-post-placeholder">No media</div>
                )}
                <div className="ig-profile-post-overlay">
                  <span>❤️ {post.likeCount}</span>
                  <span>💬 {post.commentCount}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ig-profile-empty">
            <span className="ig-profile-empty-icon">📷</span>
            <h3>No Posts Yet</h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
