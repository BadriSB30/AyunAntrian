import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-4 w-full">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="text-sm sm:text-base font-semibold">
                    <a 
                        href="https://www.youtube.com/@a.y.u.n0o0" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >
                        <span className='text-blue-400'>Ayun</span> Antrian
                    </a>
                </div>
                <div className="text-sm sm:text-base text-gray-300 text-center sm:text-right">
                    &copy; {new Date().getFullYear()} All Rights Reserved || Version 1.0.0
                </div>
            </div>
        </footer>
    );
};

export default Footer;
