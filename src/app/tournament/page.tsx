import RequestForm, { type Field } from '../RequestForm';
export const metadata = { title: 'Tournament jerseys' };
const fields: Field[] = [
  { name: 'customer_name', label: 'Your name', required: true }, { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', required: true }, { name: 'email', label: 'Email', type: 'email' },
  { name: 'team_name', label: 'Team / organisation name' }, { name: 'sport', label: 'Sport' }, { name: 'quantity', label: 'Number of jerseys', type: 'number', required: true }, { name: 'required_date', label: 'Required by', type: 'date' },
  { name: 'tournament_name', label: 'Tournament name' },
  { name: 'requirements', label: 'Design, sizes and other requirements', type: 'textarea' }];
export default function Page() { return (<div className="mx-auto max-w-2xl px-4 py-10"><h1 className="font-display text-5xl font-bold uppercase">Tournament jerseys</h1><p className="mb-8 mt-3 text-neutral-700">Jerseys for cricket, tennis cricket, football, college, department, local and corporate tournaments.</p><RequestForm kind="tournament" fields={fields} cta="Request tournament quote" /></div>); }
