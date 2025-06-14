// app/(auth)/layout.jsx
export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen flex items-center justify-center flex-1 overflow-y-auto p-6">
      {children}
    </main>
  );
}
