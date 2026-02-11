import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '박훈일 | Frontend Developer',
  description: '깔끔하고 정교한 웹 경험을 만드는 프론트엔드 개발자',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
