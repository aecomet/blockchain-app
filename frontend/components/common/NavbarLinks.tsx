import { NavLink } from '@mantine/core';
import { IconHome2 } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * Navbar のリンク
 * @returns {@link JSX.Element} - Navbar のリンク
 */
export const NavbarLinks = () => {
  const links = [
    {
      icon: <IconHome2 size={20} />,
      color: 'green',
      label: 'Home',
      path: '/'
    }
  ];

  const [active, setActive] = useState(0);
  const linkElements = links.map((link, index) => (
    <NavLink
      component={Link}
      href={link.path}
      key={link.label}
      active={index === active}
      label={link.label}
      leftSection={link.icon}
      onClick={() => setActive(index)}
    />
  ));
  return <div>{linkElements}</div>;
};
