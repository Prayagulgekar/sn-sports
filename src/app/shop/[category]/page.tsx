import { redirect } from 'next/navigation';
export default function Cat({ params }: { params: { category: string } }) { redirect(`/shop?category=${encodeURIComponent(params.category)}`); }
