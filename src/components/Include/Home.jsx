import React from 'react';
import Head from 'next/head';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Head>
        <title>AYUN ~ Laundry</title>
        <link rel="icon" href="/Logo.png" />
      </Head>
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
