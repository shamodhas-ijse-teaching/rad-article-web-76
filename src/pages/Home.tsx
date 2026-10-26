import React, { useEffect, useState } from "react"
import { createARticle, getAllArticles } from "../service/article"

export default function Home() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [articles, setArticles] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const fetchArticles = async () => {
    try {
      const res = await getAllArticles(page, 10)
      setArticles(res.data)
      setTotalPages(res.meta.totalPage || 1)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [page])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      if (!file.type.startsWith("image/")) {
        return alert("Please select a valid image file")
      }
      setImageFile(file)

      // Generate a temporary URL for the preview
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      return alert("Title and Content are required")
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    if (imageFile) formData.append("image", imageFile)

    try {
      await createARticle(formData)

      setTitle("")
      setContent("")
      removeImage()

      if (page === 1) {
        fetchArticles()
      } else {
        setPage(1)
      }
    } catch (error) {
      console.error("Failed to create article", error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans text-gray-800">
      <form
        onSubmit={submitForm}
        className="flex flex-col gap-4 p-6 mb-10 bg-white shadow-md rounded-xl border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create Article
        </h2>
        <input
          type="text"
          placeholder="Article Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />
        <textarea
          placeholder="Write your content here..."
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-y"
        />
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${imagePreview ? "hidden" : "block"}`}
          />
        </div>
        {imagePreview && (
          <div className="relative mt-2 w-full md:w-1/2">
            <img
              src={imagePreview}
              alt="Selected Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold p-2 rounded-full shadow-md transition-colors"
              title="Remove image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <button
          type="submit"
          className="mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Publish Article
        </button>
      </form>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Latest Articles
        </h2>

        <div className="flex flex-col gap-6">
          {articles.length === 0 ? (
            <p className="text-gray-500 italic">
              No articles found. Be the first to publish!
            </p>
          ) : (
            articles.map((art: any) => (
              <article
                key={art._id}
                className="p-6 bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {art.title}
                </h3>
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                  {art.content}
                </p>
                {art.imageURL && (
                  <img
                    src={art.imageURL}
                    alt={art.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
              </article>
            ))
          )}
        </div>
        {articles.length > 0 && (
          <div className="flex justify-between items-center mt-8 p-4 bg-gray-50 rounded-lg">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              &larr; Prev
            </button>

            <span className="font-medium text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
