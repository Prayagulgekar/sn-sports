import RequestForm, { type Field } from '../RequestForm';
export const metadata = { title: 'Custom jersey design' };
const fields: Field[] = [
  { name: 'customer_name', label: 'Your name', required: true }, { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', required: true }, { name: 'email', label: 'Email', type: 'email' },
  { name: 'team_name', label: 'Team / organisation name' }, { name: 'sport', label: 'Sport' }, { name: 'quantity', label: 'Number of jerseys', type: 'number', required: true }, { name: 'required_date', label: 'Required by', type: 'date' },
  { name: 'colors', label: 'Preferred colours' }, { name: 'jersey_style', label: 'Jersey style' }, { name: 'sponsor', label: 'Sponsor' },
  { name: 'requirements', label: 'Design, sizes and other requirements', type: 'textarea' }];
export default function Page() { return (<div className="mx-auto max-w-2xl px-4 py-10"><h1 className="font-display text-5xl font-bold uppercase">Custom jersey design</h1><p className="mb-8 mt-3 text-neutral-700">Tell us your colours, style and names or numbers. We will send a design for approval.</p><RequestForm kind="custom" fields={fields} cta="Request design" /></div>); }
