import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  addComment,
  getAllPosts,
  likePost,
  getProfile,
  followUser,
  getSuggestedUsers,
} from '../api/api'

const fallbackPosts = [
  {
    id: 'demo-1',
    user: 'Luna Studio',
    handle: '@luna.designs',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    time: '2h ago',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    likes: 1842,
    caption: 'Morning light and quiet corners. Designing a space that breathes.',
    tags: ['#interiors', '#minimal', '#sunrise'],
    comments: [
      { user: 'Kai', text: 'The tones are so calming 🔥' },
      { user: 'Zoe', text: 'Need this vibe in my studio.' },
    ],
  },
  // {
  //   id: 'demo-2',
  //   user: 'Urban Stories',
  //   handle: '@urbanstories',
  //   avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  //   time: '5h ago',
  //   image: 'https://images.unsplash.com/photo-1526402464764-8cbb60c7c54e?auto=format&fit=crop&w=1600&q=80',
  //   likes: 956,
  //   caption: 'Golden hour reflections downtown.',
  //   tags: ['#city', '#photography', '#goldenhour'],
  //   comments: [
  //     { user: 'Mila', text: 'That symmetry 🙌' },
  //     { user: 'Arlo', text: 'Frames within frames. Love it.' },
  //   ],
  // },
]

const fallbackSuggestions = [
  {
    id: 'sug-1',
    username: 'travel_adventures',
    name: 'Travel Adventures',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    mutualFollowers: 'Followed by john_doe + 3 more',
  },
  {
    id: 'sug-2',
    username: 'foodie_delights',
    name: 'Foodie Delights',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    mutualFollowers: 'Followed by sarah_k',
  },
  {
    id: 'sug-3',
    username: 'art_gallery',
    name: 'Art Gallery',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    mutualFollowers: 'New to MediaConnect',
  },
  {
    id: 'sug-4',
    username: 'fitness_pro',
    name: 'Fitness Pro',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    mutualFollowers: 'Followed by mike_fit + 5 more',
  },
  {
    id: 'sug-5',
    username: 'nature_lover',
    name: 'Nature Lover',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    mutualFollowers: 'Suggested for you',
  },
]

function FeedPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [likeLoading, setLikeLoading] = useState({})
  const [commentText, setCommentText] = useState({})
  const [currentUser, setCurrentUser] = useState(null)
  const [activeNav, setActiveNav] = useState('home')
  const [followingIds, setFollowingIds] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const [postsData, profileData, suggestionsData] = await Promise.all([
          getAllPosts(),
          getProfile().catch(() => null),
          getSuggestedUsers().catch(() => []),
        ])

        if (!mounted) return

        setPosts(Array.isArray(postsData) ? postsData : [])

        if (profileData) {
          setCurrentUser(profileData)
          const normalizedFollowings = Array.isArray(profileData.followings)
            ? profileData.followings
                .map((item) => {
                  if (!item) return null
                  if (typeof item === 'string') return item
                  if (typeof item === 'object' && item._id) {
                    return item._id.toString?.() ?? String(item._id)
                  }
                  return item.toString ? item.toString() : null
                })
                .filter(Boolean)
            : []
          setFollowingIds(normalizedFollowings)
        } else {
          setCurrentUser(null)
          setFollowingIds([])
        }

        setSuggestions(Array.isArray(suggestionsData) ? suggestionsData : [])
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load posts')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => {
      mounted = false
    }
  }, [])

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const formattedPosts = useMemo(() => {
    if (!posts.length) return fallbackPosts
    return posts.map((post, idx) => {
      const image = Array.isArray(post.media) ? post.media[0] : null
      const createdAt = post.createdAt ? new Date(post.createdAt) : null
      const creator =
        typeof post.createdBy === 'object' && post.createdBy !== null
          ? post.createdBy
          : null
      const username =
        creator?.username ||
        (typeof post.createdBy === 'string'
          ? `user_${post.createdBy.slice(-4)}`
          : 'Unknown creator')
      const ownerId =
        creator?._id != null
          ? typeof creator._id === 'string'
            ? creator._id
            : creator._id.toString?.() ?? String(creator._id)
          : null
      return {
        id: post._id || idx,
        ownerId,
        user: username,
        handle: `@${username}`,
        avatar:
          creator?.profile?.avatar ||
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
        time: createdAt ? getTimeAgo(createdAt) : 'just now',
        mediaCount: Array.isArray(post.media) ? post.media.length : 0,
        image:
          image ||
          'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
        likes: post.likeCount ?? 0,
        caption: post.caption || '',
        tags: [],
        comments: post.comments || [],
        raw: post,
      }
    })
  }, [posts])

  const handleLike = async (postId) => {
    if (likeLoading[postId]) return
    try {
      setLikeLoading((prev) => ({ ...prev, [postId]: true }))
      const res = await likePost(postId)
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likeCount: res.likeCount } : p,
        ),
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLikeLoading((prev) => ({ ...prev, [postId]: false }))
    }
  }

  const handleAddComment = async (postId) => {
    const text = commentText[postId]?.trim()
    if (!text) return
    try {
      const newComment = await addComment(postId, { text })
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p,
        ),
      )
      setCommentText((prev) => ({ ...prev, [postId]: '' }))
    } catch (err) {
      console.error(err)
    }
  }

  const handleFollow = async (userId) => {
    const idStr = userId?.toString()
    if (!idStr || followingIds.includes(idStr)) return
    try {
      await followUser(idStr)
      setFollowingIds((prev) => (prev.includes(idStr) ? prev : [...prev, idStr]))
      setSuggestions((prev) =>
        prev.filter((item) => {
          const suggestionId =
            item?._id != null
              ? item._id.toString?.() ?? String(item._id)
              : item?.id
          return suggestionId !== idStr
        }),
      )
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              followingCount: (prev.followingCount || 0) + 1,
            }
          : prev,
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleNavClick = (nav) => {
    setActiveNav(nav)
    if (nav === 'profile') {
      navigate('/me')
    } else if (nav === 'create') {
      setShowCreateModal(true)
    } else if (nav === 'home') {
      navigate('/feed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const suggestionsToRender = suggestions.length ? suggestions : fallbackSuggestions

  return (
    <div className="instagram-layout">
      {/* Left Sidebar - Navigation */}
      <aside className="ig-sidebar">
        <div className="ig-logo">
          <h1>MediaConnect</h1>
        </div>
        
        <nav className="ig-nav">
          <button 
            className={`ig-nav-item ${activeNav === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            <span className="ig-nav-icon">🏠</span>
            <span className="ig-nav-label">Home</span>
          </button>
          
          <button 
            className={`ig-nav-item ${activeNav === 'search' ? 'active' : ''}`}
            onClick={() => handleNavClick('search')}
          >
            <span className="ig-nav-icon">🔍</span>
            <span className="ig-nav-label">Search</span>
          </button>
          
          <button 
            className={`ig-nav-item ${activeNav === 'explore' ? 'active' : ''}`}
            onClick={() => handleNavClick('explore')}
          >
            <span className="ig-nav-icon">🧭</span>
            <span className="ig-nav-label">Explore</span>
          </button>
          
          <button 
            className={`ig-nav-item ${activeNav === 'messages' ? 'active' : ''}`}
            onClick={() => handleNavClick('messages')}
          >
            <span className="ig-nav-icon">💬</span>
            <span className="ig-nav-label">Messages</span>
          </button>
          
          <button 
            className={`ig-nav-item ${activeNav === 'notifications' ? 'active' : ''}`}
            onClick={() => handleNavClick('notifications')}
          >
            <span className="ig-nav-icon">❤️</span>
            <span className="ig-nav-label">Notifications</span>
          </button>
          
          <button 
            className={`ig-nav-item ${activeNav === 'create' ? 'active' : ''}`}
            onClick={() => handleNavClick('create')}
          >
            <span className="ig-nav-icon">➕</span>
            <span className="ig-nav-label">Create</span>
          </button>
          
          <button 
            className={`ig-nav-item ${activeNav === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
          >
            <span className="ig-nav-icon">👤</span>
            <span className="ig-nav-label">Profile</span>
          </button>
        </nav>
        
        <div className="ig-nav-footer">
          <button className="ig-nav-item" onClick={handleLogout}>
            <span className="ig-nav-icon">🚪</span>
            <span className="ig-nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content - Feed */}
      <main className="ig-main">
        <div className="ig-feed-container">
          {loading && <div className="ig-loading">Loading feed…</div>}
          {error && <div className="ig-error">{error}</div>}

          <section className="ig-feed">
            {formattedPosts.map((post) => (
              <article key={post.id} className="ig-post">
                <header className="ig-post-header">
                  <div className="ig-post-user" onClick={() => post.ownerId && navigate(`/profile/${post.ownerId}`)}>
                    <img src={post.avatar} alt={post.user} className="ig-avatar" />
                    <div className="ig-post-user-info">
                      <p className="ig-username">{post.user}</p>
                      <p className="ig-time">{post.time}</p>
                    </div>
                  </div>
                  <button className="ig-more-btn">•••</button>
                </header>

                <div className="ig-post-media">
                  <img src={post.image} alt={post.caption || 'Post media'} />
                </div>

                <div className="ig-post-actions">
                  <div className="ig-post-actions-left">
                    <button
                      className="ig-action-btn"
                      onClick={() => handleLike(post.raw?._id || post.id)}
                      disabled={likeLoading[post.raw?._id || post.id]}
                    >
                      {likeLoading[post.raw?._id || post.id] ? '⏳' : '❤️'}
                    </button>
                    <button
                      className="ig-action-btn"
                      onClick={() => {
                        const el = document.getElementById(`comment-input-${post.id}`)
                        if (el) el.focus()
                      }}
                    >
                      💬
                    </button>
                    <button className="ig-action-btn">📤</button>
                  </div>
                  <button className="ig-action-btn ig-save-btn">🔖</button>
                </div>

                <div className="ig-post-info">
                  <p className="ig-likes">{post.likes.toLocaleString()} likes</p>
                  <p className="ig-caption">
                    <span className="ig-caption-user">{post.user}</span> {post.caption}
                  </p>
                  {post.tags?.length > 0 && (
                    <div className="ig-tags">
                      {post.tags.map((tag) => (
                        <span key={tag} className="ig-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  {post.comments?.length > 0 && (
                    <button className="ig-view-comments">
                      View all {post.comments.length} comments
                    </button>
                  )}
                  <div className="ig-comments">
                    {post.comments?.slice(0, 2).map((comment) => (
                      <p key={`${post.id}-${comment._id || comment.text}`} className="ig-comment">
                        <span className="ig-comment-user">
                          {comment.user?.username || comment.user || 'User'}
                        </span>{' '}
                        {comment.text}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="ig-add-comment">
                  <input
                    id={`comment-input-${post.id}`}
                    type="text"
                    placeholder="Add a comment…"
                    value={commentText[post.raw?._id || post.id] || ''}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [post.raw?._id || post.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(post.raw?._id || post.id)
                      }
                    }}
                  />
                  <button
                    className="ig-post-comment-btn"
                    onClick={() => handleAddComment(post.raw?._id || post.id)}
                    disabled={!commentText[post.raw?._id || post.id]?.trim()}
                  >
                    Post
                  </button>
                </div>
              </article>
            ))}
            {!loading && !formattedPosts.length && (
              <div className="ig-empty">No posts yet. Create the first post!</div>
            )}
          </section>
        </div>
      </main>

      {/* Right Sidebar - Suggestions */}
      <aside className="ig-suggestions">
        {currentUser && (
          <div className="ig-current-user" onClick={() => navigate('/me')}>
            <img 
              src={currentUser.profile?.avatar || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80'} 
              alt={currentUser.username} 
              className="ig-avatar-large"
            />
            <div className="ig-current-user-info">
              <p className="ig-username">{currentUser.username}</p>
              <p className="ig-name">{currentUser.name || currentUser.username}</p>
            </div>
            <button className="ig-switch-btn">Switch</button>
          </div>
        )}

        <div className="ig-suggestions-header">
          <span>Suggested for you</span>
          <button className="ig-see-all">See All</button>
        </div>

        <div className="ig-suggestions-list">
          {suggestionsToRender.map((user) => {
            const rawId = user?._id ?? user?.id
            const suggestionId =
              rawId != null
                ? typeof rawId === 'string'
                  ? rawId
                  : rawId.toString?.() ?? String(rawId)
                : ''
            const avatar =
              user?.profile?.avatar ||
              user?.avatar ||
              'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80'
            const username = user?.username || 'user'
            const meta =
              user?.mutualFollowers ||
              (typeof user?.followerCount === 'number'
                ? `${user.followerCount} follower${user.followerCount === 1 ? '' : 's'}`
                : 'Suggested for you')
            const isFollowing = suggestionId ? followingIds.includes(suggestionId) : false
            const canFollow = Boolean(user?._id)
            return (
              <div key={suggestionId || username} className="ig-suggestion-item">
                <img src={avatar} alt={username} className="ig-avatar" />
                <div className="ig-suggestion-info">
                  <p className="ig-username">{username}</p>
                  <p className="ig-mutual">{meta}</p>
                </div>
                <button
                  className={`ig-follow-btn ${isFollowing ? 'following' : ''}`}
                  disabled={!canFollow || isFollowing}
                  onClick={() => canFollow && handleFollow(suggestionId)}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="ig-footer">
          <p className="ig-footer-links">
            About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language
          </p>
          <p className="ig-copyright">© 2024 MEDIACONNECT</p>
        </div>
      </aside>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="ig-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="ig-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ig-modal-header">
              <h2>Create new post</h2>
              <button className="ig-modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="ig-modal-body">
              <div className="ig-upload-area">
                <span className="ig-upload-icon">📷</span>
                <p>Drag photos and videos here</p>
                <button className="ig-select-btn">Select from computer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedPage

