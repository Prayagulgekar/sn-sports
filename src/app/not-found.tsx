import Link from 'next/link';
export default function NotFound() { return <div className="px-4 py-16 text-center sm:py-24"><h1 className="font-display text-4xl font-bold uppercase sm:text-6xl">Page not found</h1><Link href="/shop" className="btn btn-blue mt-6">Back to shop</Link></div>; }
