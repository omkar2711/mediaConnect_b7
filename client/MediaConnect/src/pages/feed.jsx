import { useEffect, useMemo, useState } from 'react'
import { addComment, getAllPosts, likePost } from '../api/api'

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
  {
    id: 'demo-2',
    user: 'Urban Stories',
    handle: '@urbanstories',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    time: '5h ago',
    image: 'https://images.unsplash.com/photo-1526402464764-8cbb60c7c54e?auto=format&fit=crop&w=1600&q=80',
    likes: 956,
    caption: 'Golden hour reflections downtown.',
    tags: ['#city', '#photography', '#goldenhour'],
    comments: [
      { user: 'Mila', text: 'That symmetry 🙌' },
      { user: 'Arlo', text: 'Frames within frames. Love it.' },
    ],
  },
]

function FeedPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [likeLoading, setLikeLoading] = useState({})
  const [commentText, setCommentText] = useState({})

  useEffect(() => {
    let mounted = true
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const data = await getAllPosts()
        if (mounted) setPosts(Array.isArray(data) ? data : [])
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load posts')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchPosts()
    return () => {
      mounted = false
    }
  }, [])

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
      return {
        id: post._id || idx,
        user: username,
        handle: `@${username}`,
        avatar:
          creator?.profile?.avatar ||
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
        time: createdAt ? createdAt.toLocaleString() : 'just now',
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

  return (
    <div className="feed-page">
      <div className="feed-hero">
        <div>
          <p className="eyebrow">Home</p>
          {/* <h2>MediaConnect</h2> */}
          {/* <p className="muted">See the latest posts in a clean, Instagram-like layout.</p> */}
        </div>
      </div>

      {loading && <div className="status-chip">Loading feed…</div>}
      {error && <div className="status-chip error">{error}</div>}

      <section className="feed-vertical">
        {formattedPosts.map((post) => (
          <article key={post.id} className="post-card">
            <header className="post-header">
              <div className="user">
                <img src={post.avatar} alt={post.user} />
                <div>
                  <p className="name">{post.user}</p>
                  <p className="handle">{post.handle}</p>
                </div>
              </div>
              <span className="time">{post.time}</span>
            </header>

            <div className="post-media">
              <img src={post.image} alt={post.caption || 'Post media'} />
              <div className="media-overlay">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments?.length || 0}</span>
                {post.mediaCount > 1 ? <span>🖼️ {post.mediaCount}</span> : null}
              </div>
            </div>

            <div className="post-meta">
              <p className="caption">
                <span className="name">{post.user}</span> {post.caption}
              </p>
              {post.tags?.length ? (
                <div className="tag-row">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="comments">
                {post.comments?.slice(0, 2).map((comment) => (
                  <p key={`${post.id}-${comment._id || comment.text}`}>
                    <span className="name">
                      {comment.user?.username || comment.user || 'User'}
                    </span>{' '}
                    {comment.text}
                  </p>
                ))}
              </div>
            </div>

            <div className="post-actions card-actions">
              <div className="left">
                <button
                  title="Like"
                  type="button"
                  onClick={() => handleLike(post.raw?._id || post.id)}
                  disabled={likeLoading[post.raw?._id || post.id]}
                >
                  {likeLoading[post.raw?._id || post.id] ? '⏳' : '❤️'}
                </button>
                <button
                  title="Comment"
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(`comment-input-${post.id}`)
                    if (el) el.focus()
                  }}
                >
                  💬
                </button>
                <button title="Share">📤</button>
              </div>
              <button className="save" title="Save">
                📌
              </button>
            </div>

            <div className="comment-input-row">
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
              />
              <button
                type="button"
                className="primary small"
                onClick={() => handleAddComment(post.raw?._id || post.id)}
              >
                Post
              </button>
            </div>
          </article>
        ))}
        {!loading && !formattedPosts.length && (
          <div className="empty">No posts yet. Create the first post!</div>
        )}
      </section>
    </div>
  )
}

export default FeedPage

