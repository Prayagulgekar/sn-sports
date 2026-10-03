import Link from 'next/link';
export default function NotFound() { return <div className="px-4 py-24 text-center"><h1 className="font-display text-6xl font-bold uppercase">Page not found</h1><Link href="/shop" className="btn btn-blue mt-6">Back to shop</Link></div>; }
