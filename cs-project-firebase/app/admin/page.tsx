
'use client'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, getIdToken } from 'firebase/auth'
import { authClient, storageClient } from '@/lib/firebaseClient'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  priceCents: z.coerce.number().int().min(100),
  isPublished: z.coerce.boolean()
})

export default function AdminPage(){
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({ title:'', slug:'', description:'', priceCents: 2900, isPublished: true })
  const [imageFile, setImageFile] = useState<File|null>(null)
  const [productFile, setProductFile] = useState<File|null>(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const auth = authClient()
    return onAuthStateChanged(auth, setUser)
  }, [])

  const onSubmit = async () => {
    setStatus('')
    const parsed = schema.safeParse(form)
    if (!parsed.success) { setStatus('Invalid form'); return }
    if (!user) { window.location.href = '/login'; return }

    const storage = storageClient()
    let imageUrl: string | null = null
    let filePath: string | null = null

    if (imageFile) {
      const imgRef = ref(storage, `images/${crypto.randomUUID()}_${imageFile.name}`)
      await uploadBytes(imgRef, imageFile)
      imageUrl = await getDownloadURL(imgRef)
    }
    if (productFile) {
      const fileRef = ref(storage, `product-files/${crypto.randomUUID()}_${productFile.name}`)
      await uploadBytes(fileRef, productFile)
      filePath = fileRef.fullPath // private path
    }

    const token = await getIdToken(user, true)
    const res = await fetch('/api/admin/createProduct', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...form, imageUrl, filePath })
    })
    const data = await res.json()
    setStatus(data.error ? data.error : 'Created!')
    if (!data.error) {
      setForm({ title:'', slug:'', description:'', priceCents: 2900, isPublished: true })
      setImageFile(null); setProductFile(null)
    }
  }

  return (
    <div className="max-w-2xl card p-6">
      <h1 className="text-xl font-semibold mb-4">New Product</h1>
      <div className="grid gap-3">
        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        </div>
        <div>
          <label className="label">Slug</label>
          <input className="input" value={form.slug} onChange={e=>setForm({...form, slug:e.target.value})} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input h-28" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Price (USD cents)</label>
            <input className="input" type="number" value={form.priceCents} onChange={e=>setForm({...form, priceCents:Number(e.target.value)})} />
          </div>
          <div className="flex items-end gap-2">
            <input id="pub" type="checkbox" checked={form.isPublished} onChange={e=>setForm({...form, isPublished:e.target.checked})} />
            <label htmlFor="pub" className="label">Published</label>
          </div>
        </div>
        <div>
          <label className="label">Cover Image</label>
          <input type="file" onChange={e=>setImageFile(e.target.files?.[0]||null)} />
        </div>
        <div>
          <label className="label">Product File (zip/pdf/etc.)</label>
          <input type="file" onChange={e=>setProductFile(e.target.files?.[0]||null)} />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={onSubmit}>Create</button>
          {status && <p className="text-sm text-gray-400">{status}</p>}
        </div>
      </div>
    </div>
  )
}
