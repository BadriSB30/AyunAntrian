// src/app/laporan/page.jsx
"use client";

import React, { useEffect, useState } from 'react'
import ScrollInSection from '@/components/Animate/ScroolInSelection'
import LaporanDesktop from '@/components/Laporan/LaporanDesktop'
import LaporanMobile from '@/components/Laporan/LaporanMobile'

const LaporanPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaundry = async () => {
      try {
        const response = await fetch('/api/antrian/list');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching antrian:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaundry();
  }, []);

  return (
      <div>
        <ScrollInSection>
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              <LaporanDesktop data={data} />
              <LaporanMobile data={data} />
            </>
          )}
        </ScrollInSection>
      </div>
  );
};

export default LaporanPage;
