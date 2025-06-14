'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/Dashboard/Card';
import BarChart from '@/components/Dashboard/BarChart';

export default function DashboardPage() {
  const [total, setTotal] = useState(0);
  const [ruangan, setRuangan] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const [totalRes, ruanganRes] = await Promise.all([
          fetch(`${baseUrl}/api/antrian/total`),
          fetch(`${baseUrl}/api/antrian/ruangan`),
        ]);

        const totalData = await totalRes.json();
        const ruanganData = await ruanganRes.json();

        setTotal(totalData.total_antrian);
        setRuangan(ruanganData.total_ruangan);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <Card total={total} ruangan={ruangan} />
      <BarChart total={total} ruangan={ruangan} />
    </div>
  );
}
