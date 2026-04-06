import './globals.css';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  title: 'PLAYZLIFE | VR Motion Universe',
  description: 'Pro-level motion gaming without the headset. Ultra-detailed 3D environments and AI pose tracking.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-[#0a0e1a] text-white">
        {children}
      </body>
    </html>
  );
}
