import React from 'react';

export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
         <img
            {...props}
            src="/images/logo.png"  // Ganti dengan path yang sesuai
            alt="Logo"
            style={{ width: '100px',
                height: '50px' ,
                // marginBottom:'30px',
                // display: 'block',  // Menjadikan gambar blok supaya bisa di-center
                // marginLeft: 'auto',  // Menentukan margin kiri otomatis
                // marginRight: 'auto',
            }}  // Sesuaikan ukuran sesuai kebutuhan
        />
    );
}
