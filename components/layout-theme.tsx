'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function PageTheme({ children, theme }: { children: React.ReactNode, theme: string }) {
    const { setTheme } = useTheme();
  
    useEffect(() => {
      setTheme(theme); // set the theme based on the prop
      Cookies.set('theme', theme); // save the theme to a cookie
    }, [theme, setTheme]);
  
    return <div>{children}</div>;
  }