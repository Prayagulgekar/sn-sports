import RequestForm, { type Field } from '../RequestForm';
export const metadata = { title: 'League jerseys' };
const fields: Field[] = [
  { name: 'customer_name', label: 'Your name', required: true }, { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', required: true }, { name: 'email', label: 'Email', type: 'email' },
  { name: 'team_name', label: 'Team / organisation name' }, { name: 'sport', label: 'Sport' }, { name: 'quantity', label: 'Number of jerseys', type: 'number', required: true }, { name: 'required_date', label: 'Required by', type: 'date' },
  { name: 'league_name', label: 'League name' }, { name: 'number_of_teams', label: 'Number of teams', type: 'number' }, { name: 'team_names', label: 'Team names' },
  { name: 'requirements', label: 'Design, sizes and other requirements', type: 'textarea' }];
export default function Page() { return (<div className="mx-auto max-w-2xl px-4 py-8 sm:py-10"><h1 className="break-words font-display text-3xl font-bold uppercase sm:text-4xl md:text-5xl">League jerseys</h1><p className="mb-8 mt-3 text-neutral-700">Organising a league? Share the number of teams and players and we will prepare a quote.</p><RequestForm kind="league" fields={fields} cta="Submit league request" /></div>); }
