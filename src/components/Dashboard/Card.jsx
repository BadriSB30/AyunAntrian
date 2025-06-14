import React from 'react';
import HoverScaleSection from '../Animate/HoverScaleSelection';
import ScrollInSection from '../Animate/ScroolInSelection';

const CardItem = ({ title, value }) => (
  <ScrollInSection>
    <HoverScaleSection>
      <div className="bg-white shadow-lg rounded-xl px-1 py-1 md:px-4 md:py-4 flex flex-col items-center justify-center w-full">
        <p className="font-semibold text-sm md:text-lg text-center">{title}</p>
        <p className="text-xl md:text-2xl text-blue-600 font-semibold">{value}</p>
      </div>
    </HoverScaleSection>
  </ScrollInSection>
);

const Card = ({ total, ruangan }) => {
  const cards = [
    { title: 'Total Antrian', value: total },
    { title: 'Jumlah Ruangan', value: ruangan },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {cards.map((card, index) => (
        <CardItem key={index} title={card.title} value={card.value} />
      ))}
    </div>
  );
};

export default Card;
