import React, { ReactNode } from 'react';
import { Menu } from '../Menu'; // Menyu komponentini import qilamiz

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <main>{children}</main> {/* Asosiy content sahifalar uchun */}
      <Menu /> {/* Har bir sahifada chiqadigan menyu */}
    </>
  );
};

export default Layout;
