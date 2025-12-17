import { useEffect, useMemo, useState } from 'react'
import { getUserById } from '../api/api'

const fallbackProfile = {
  username: 'creator',
  email: 'creator@example.com',
  profile: {
    firstName: 'Guest',
    lastName: 'Creator',
    bio: 'Exploring profiles across MediaConnect.',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
  followerCount: 0,
  followingCount: 0,
  posts: [],
}

function ProfilePage({ userId }) {
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) {
      setStatus('done')
      return
    }
    let mounted = true
    const fetchProfile = async () => {
      try {
        const data = await getUserById(userId)
        if (mounted) setProfile(data)
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load profile')
      } finally {
        if (mounted) setStatus('done')
      }
    }
    fetchProfile()
    return () => {
      mounted = false
    }
  }, [userId])

  const user = useMemo(() => profile || fallbackProfile, [profile])

  return (
    <div className="profile-page">
      {status === 'loading' && <div className="status-chip">Loading profile…</div>}
      {error && <div className="status-chip error">{error}</div>}
      {!userId && (
        <div className="status-chip">
          Enter a user ID to load their public profile (requires backend route).
        </div>
      )}

      <div className="profile-hero">
        <div className="avatar xl">
          <img src={user?.profile?.avatar} alt={user?.username} />
        </div>
        <div className="profile-meta">
          <div className="row">
            <h2>{user?.username}</h2>
            <button className="primary">Follow</button>
          </div>
          <div className="counts">
            <span>
              <strong>{user?.posts?.length || 0}</strong> posts
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
        <h3>Moments</h3>
        {user?.posts?.length ? (
          <div className="media-grid">
            {user.posts.map((post) => (
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
          <div className="empty">No posts yet.</div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage

