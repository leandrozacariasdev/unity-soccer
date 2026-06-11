import Link from 'next/link';
import Image from 'next/image';

export const metadata = { title: 'Login · Admin' };

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="flex justify-center mb-8">
            <Image
              src="/images/logo.jpeg"
              alt="Unity Soccer"
              width={180}
              height={72}
              className="h-16 w-auto invert"
            />
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
