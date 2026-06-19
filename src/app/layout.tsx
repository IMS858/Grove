export const metadata = {
  title: "Grove",
  description: "Your garden, running.",
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0B110E" }}>{children}</body>
    </html>
  )
}
