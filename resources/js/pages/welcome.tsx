import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    //console.log('auth',auth);
    function handleLogout() {
        router.post(route('logout'));
        }
     const [dateTime, setDateTime] = useState<Date | undefined>(undefined);
    return (
        <>
            <Head title="Pinjam Kelas">

            </Head>
           <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">

  {/* Navbar */}
  <header className="w-full bg-[#FDFDFC] shadow-md dark:bg-[#18181b]">
    <nav className="flex justify-between items-center p-4 max-w-screen-xl mx-auto">
      {/* Logo or Title */}
      <div className="text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
        <span>My App</span>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6">
        {auth.user ? (
          <>
            {auth.user.role_id === 1 && (
              <Link
                href={route('dashboard')}
                className="text-[#1b1b18] dark:text-[#EDEDEC] hover:text-indigo-600"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-[#1b1b18] dark:text-[#EDEDEC] hover:text-indigo-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href={route('login')}
              className="text-[#1b1b18] dark:text-[#EDEDEC] hover:text-indigo-600"
            >
              Log in
            </Link>
            <Link
              href={route('register')}
              className="text-[#1b1b18] dark:text-[#EDEDEC] hover:text-indigo-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  </header>

  {/* Main Content */}
  <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-8">

    {/* Carousel Section */}
    <div className="w-full max-w-4xl relative overflow-hidden rounded-lg shadow-lg mb-10">
      <div className="relative">
        {/* Slide 1 */}
        <input
          className="carousel-open"
          type="radio"
          id="carousel-1"
          name="carousel"
          aria-hidden="true"
          hidden
          defaultChecked
        />
        <div className="carousel-item absolute opacity-0 transition-opacity duration-1000">
          <img
            src="https://source.unsplash.com/800x300/?building"
            alt="Gedung 1"
            className="block w-full rounded-lg"
          />
        </div>

        {/* Slide 2 */}
        <input
          className="carousel-open"
          type="radio"
          id="carousel-2"
          name="carousel"
          aria-hidden="true"
          hidden
        />
        <div className="carousel-item absolute opacity-0 transition-opacity duration-1000">
          <img
            src="https://source.unsplash.com/800x300/?room"
            alt="Ruangan 2"
            className="block w-full rounded-lg"
          />
        </div>

        {/* Slide 3 */}
        <input
          className="carousel-open"
          type="radio"
          id="carousel-3"
          name="carousel"
          aria-hidden="true"
          hidden
        />
        <div className="carousel-item absolute opacity-0 transition-opacity duration-1000">
          <img
            src="https://source.unsplash.com/800x300/?clock,time"
            alt="Jam 3"
            className="block w-full rounded-lg"
          />
        </div>

        {/* Carousel Controls */}
        <label
          htmlFor="carousel-3"
          className="prev control absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer text-3xl font-bold text-white p-2 select-none z-10"
        >
          ‹
        </label>
        <label
          htmlFor="carousel-2"
          className="next control absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-3xl font-bold text-white p-2 select-none z-10"
        >
          ›
        </label>

        {/* Carousel Indicators */}
        <ol className="carousel-indicators flex justify-center gap-3 mt-3">
          <li>
            <label
              htmlFor="carousel-1"
              className="carousel-bullet cursor-pointer block text-2xl text-gray-400 hover:text-gray-700"
            >
              •
            </label>
          </li>
          <li>
            <label
              htmlFor="carousel-2"
              className="carousel-bullet cursor-pointer block text-2xl text-gray-400 hover:text-gray-700"
            >
              •
            </label>
          </li>
          <li>
            <label
              htmlFor="carousel-3"
              className="carousel-bullet cursor-pointer block text-2xl text-gray-400 hover:text-gray-700"
            >
              •
            </label>
          </li>
        </ol>
      </div>
    </div>

    {/* Search Form Section */}
  <form className="w-full max-w-full mt-10 bg-white rounded-lg shadow-md p-10 flex flex-col gap-8">
  <h2 className="text-4xl font-semibold text-black mb-6 text-center">Cari Ruangan</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-black">
    <input
      type="text"
      name="gedung"
      placeholder="Gedung"
      className="w-full px-8 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl"
    />
    <input
      type="text"
      name="ruangan"
      placeholder="Ruangan"
      className="w-full px-8 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl"
    />
       <Flatpickr
        data-enable-time
        value={dateTime}  // pakai state dateTime
        onChange={([selectedDate]) => setDateTime(selectedDate)}
        options={{
          enableTime: true,
          dateFormat: "d-m-Y H:i",
          time_24hr: true,
        }}
        placeholder="Tanggal dan Jam"
        className="w-full px-8 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl"
        name="jam"
      />
  </div>

  <button
    type="submit"
    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-10 rounded-md transition-colors text-xl"
  >
    Cari
  </button>
</form>


  </div>

  {/* Optional Footer or Bottom Spacer */}
  <div className="h-10 lg:h-14"></div>
</div>

        </>
    );
}
