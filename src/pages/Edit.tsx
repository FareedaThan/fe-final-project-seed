import React, { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactStars from 'react-stars'
import Loading from '../components/Loading'
import withGuard from '../guards/withGuard'
import useContent from '../hooks/useContent'
import classes from './Edit.module.css'
import { toast } from 'react-hot-toast'

const Edit = () => {
  const { id } = useParams()
  const {
    status: { error, loading, ready },
    data,
    editPost,
  } = useContent(id || '')
  const navigate = useNavigate()

  // Hint: we may need auth token to patch the upcoming content
  // const { token, getAuthHeader } = useAuth()
  // ORrrrrr, if you decided to put logic in `editPost` function instead,
  // like useAuth() under useContent(), we'd certainly don't need for this line

  const [updateRating, setRating] = useState(0)
  const [isSubmitting, setSubmitting] = useState(false)
  const [editComment, setEditComment] = useState('')

  useEffect(() => {
    // TODO: What should happen if we later received current content's rating?
    // const fetchData = async () => {
    //   try {
    //     const res = await fetch(`https://${host}/content/${id}`)
    //     const data = await res.json()
    //   } catch (err: any) {
    //     throw new Error(err.message)
    //   }
    // }
    // fetchData()
  }, [data])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    setSubmitting(true)

    try {
      // TODO: Try patch new content to server
      await editPost({
        comment: editComment,
        rating: updateRating,
      })
      toast.success('Post edited!')
      navigate(`/content/${id}`)
    } catch (err: any) {
      // TODO: Handling error
      throw new Error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const setStarValue = (newrating: number) => {
    setRating(newrating)
  }

  if (error) return <h1>Error</h1>
  if (loading) return <Loading />
  if (!ready) return <Loading />

  const { comment, rating } = data!

  // if (isSubmitting) return <Navigate to="/" />

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Edit content</h1>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.formGroup}>
          <label htmlFor="comment">Comment (280 characters maximum)</label>
          <input
            type="text"
            id="comment"
            defaultValue={comment}
            onChange={(e) => setEditComment(e.target.value)}
            maxLength={280}
          />
        </div>
        <div className={classes.formGroup}>
          <div className={classes.ratingContainer}>
            <label>Rating</label>
            <ReactStars count={5} value={rating} size={42} half={false} color2="#FFC26F" onChange={setStarValue} />
          </div>
        </div>
        <div className={classes.formGroup}>
          <button type="submit" disabled={isSubmitting}>
            Edit
          </button>
        </div>
      </form>
    </div>
  )
}

export default withGuard(Edit)
