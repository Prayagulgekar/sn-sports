import type { Metadata } from 'next';
import { CartProvider } from '@/lib/cart';
import { BusinessSettingsProvider } from '@/lib/business-settings';
import { supabaseServer } from '@/lib/supabase/server';
import PublicChrome from './PublicChrome';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'SN SPORTS | Custom Sports Jerseys', template: '%s | SN SPORTS' },
  description: 'Wear Your Game. Own Your Style. Custom cricket, tennis cricket and football jerseys for players, teams, tournaments and leagues.',
  openGraph: { title: 'SN SPORTS', description: 'Wear Your Game. Own Your Style.', type: 'website' },
};

async function getBusinessSettings() {
  try {
    const { data } = await supabaseServer()
      .from('settings')
      .select('phone, whatsapp')
      .eq('id', 1)
      .maybeSingle();
    return {
      phone: data?.phone?.replace(/[^\d+]/g, '') || '',
      whatsapp: data?.whatsapp?.replace(/\D/g, '') || '',
    };
  } catch {
    return { phone: '', whatsapp: '' };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { phone, whatsapp } = await getBusinessSettings();

  return (
    <html lang="en">
      <body>
        <BusinessSettingsProvider phone={phone} whatsapp={whatsapp}>
          <CartProvider>
            <PublicChrome placement="header" />
            <main>{children}</main>
            <PublicChrome placement="footer" />
          </CartProvider>
        </BusinessSettingsProvider>
      </body>
    </html>
  );
}
