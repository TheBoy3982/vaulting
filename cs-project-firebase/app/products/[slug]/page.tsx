
import { adminDB } from '@/lib/firebaseAdmin'
import CheckoutButton from './purchase'
import { notFound } from 'next/navigation'

export default async function ProductDetail({ params }: { params: { slug: string } }){
  const snap = await adminDB.collection('products').where('slug', '==', params.slug).limit(1).get()
  if (snap.empty) return notFound()
  const doc = snap.docs[0]
  const product = { id: doc.id, ...doc.data() } as any
  if (!product.isPublished) return notFound()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card overflow-hidden">
        <div className="h-64" style={{backgroundImage:`url(${product.imageUrl || ''})`, backgroundSize:'cover', backgroundPosition:'center'}} />
      </div>
      <div className="card p-6">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="text-gray-400 mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">${(product.priceCents/100).toFixed(2)}</span>
          <CheckoutButton productId={product.id} />
        </div>
      </div>
    </div>
  )
}
