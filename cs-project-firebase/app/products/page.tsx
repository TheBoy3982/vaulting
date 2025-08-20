
import Link from 'next/link'
import { adminDB } from '@/lib/firebaseAdmin'

export default async function ProductsPage(){
  const snapshot = await adminDB.collection('products').where('isPublished', '==', true).orderBy('createdAt', 'desc').get()
  const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as any[]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p:any) => (
        <Link key={p.id} href={`/products/${p.slug}`} className="card overflow-hidden">
          <div className="h-40 bg-[#151521]" style={{backgroundImage:`url(${p.imageUrl || ''})`, backgroundSize:'cover', backgroundPosition:'center'}} />
          <div className="p-4">
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-gray-400 line-clamp-2">{p.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="badge">${(p.priceCents/100).toFixed(2)}</span>
              <span className="text-sm text-gray-400">View →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
