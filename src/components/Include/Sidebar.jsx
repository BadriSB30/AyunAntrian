"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiHome,
  FiBarChart2,
} from 'react-icons/fi';
import { HiOutlineUserGroup } from "react-icons/hi"; //daftar
import { MdOutlineListAlt } from "react-icons/md"; //daftar antrian
import { HiOutlineSpeakerphone } from "react-icons/hi"; // panggil antrian
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const pathname = usePathname();

  const menu = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <FiHome />,
    },
    {
      name: 'Antrian',
      icon: <HiOutlineUserGroup />,
      subMenu: [
        {
          name: 'Daftar Antrian',
          path: '/antrian/daftar-antrian',
          icon: <MdOutlineListAlt />,
        },
        {
          name: 'Panggil Antrian',
          path: '/antrian/panggil-antrian',
          icon: <HiOutlineSpeakerphone />,
        },
      ],
    },
    {
      name: 'Laporan',
      path: '/laporan',
      icon: <FiBarChart2 />,
    },
  ];

  useEffect(() => {
    const activeDropdowns = {};
    menu.forEach((item) => {
      if (item.subMenu) {
        const isActive = item.subMenu.some((sub) => pathname === sub.path);
        if (isActive) {
          activeDropdowns[item.name] = true;
        }
      }
    });
    setDropdownOpen(activeDropdowns);
  }, [pathname]);

  const toggleDropdown = (menuName) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden bg-gray-700 p-2 text-white fixed top-4 left-4 z-50 rounded"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white w-64 p-4 z-40 transform transition-transform duration-300 ease-in-out
        fixed top-0 left-0 h-screen
        md:relative md:h-auto md:translate-x-0 md:block
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Image
            src="/Logo.png"
            alt="Logo Ayun Antrian"
            width={40}
            height={40}
            className="rounded-md"
            priority
          />
          <h1 className="text-xl font-semibold">
            <a
              href="https://www.youtube.com/@a.y.u.n0o0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-blue-400">Ayun</span> Antrian
            </a>
          </h1>
        </div>

        <ul className="space-y-2">
          {menu.map((item) =>
            item.subMenu ? (
              <li key={item.name}>
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className="w-full flex justify-between items-center px-3 py-2 text-white hover:text-blue-400 focus:outline-none"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  <div>
                    {dropdownOpen[item.name] ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {dropdownOpen[item.name] && (
                    <motion.div
                      key={item.name}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <ul className="ml-6 mt-2 space-y-1">
                        {item.subMenu.map((subItem) => {
                          const isActive = pathname === subItem.path;
                          return (
                            <li key={subItem.path}>
                              <Link
                                href={subItem.path}
                                className={`flex items-center gap-2 text-sm px-3 py-2 rounded 
                                  hover:bg-blue-100 hover:text-blue-600 
                                  ${isActive ? 'text-blue-500 bg-blue-100' : 'text-white'}`}
                              >
                                {subItem.icon}
                                <span>{subItem.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded 
                    hover:bg-blue-100 hover:text-blue-600 
                    ${pathname === item.path ? 'text-blue-500 bg-blue-100' : 'text-white'}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
