import './globals.css';

export const metadata = {
  title: 'DHA PLOTS | Phase 8 Property Network',
  description: 'Premier DHA Karachi Phase 8 Real Estate Advisory. Managed by Zeshan Khurshid (SADAF ESTATE). Direct commercial zones and residential plots directory.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 500 500%22><path d=%22M65 155 L165 115 L165 375 L65 335 Z%22 fill=%22%239CA3AF%22/><path d=%22M165 115 L245 150 L245 270 L165 235 Z%22 fill=%22%23E5E7EB%22/><path d=%22M115 150 L165 130 L165 270 L115 250 Z%22 fill=%22%23F59E0B%22/><path d=%22M165 130 L198 145 L198 270 L165 270 Z%22 fill=%22%23D97706%22/><path d=%22M245 40 L430 170 L430 335 L245 205 Z%22 fill=%22%231E293B%22/><path d=%22M305 150 L400 200 L400 335 L305 280 Z%22 fill=%22%230F172A%22/><path d=%22M308 200 L400 198 L400 335 L308 335 Z%22 fill=%22%23F59E0B%22/><path d=%22M308 200 L400 335 L308 335 Z%22 fill=%22%23B45309%22/></svg>',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}