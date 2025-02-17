'use client';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export const Footer = () => {
  const pathname = usePathname();

  // パスに応じた色を返す関数
  const getColorForPath = (path) => {
    return pathname === path ? "#5F8E63" : "#83BC87";
  };

  return (
    <>
      <BottomNavigation
        showLabels
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#EAC6AA",
          '& .MuiBottomNavigationAction-label' : {
            fontSize: '0.7rem',
            whiteSpace: 'nowrap'
          }
        }}
        className='bg-blue-500'
      >
        <BottomNavigationAction
          label="ホーム"
          icon={<HomeIcon />}
          component={Link}
          href="/"
          sx={{ color: getColorForPath('/') }}
        />
        <BottomNavigationAction
          label="検索"
          icon={<SearchIcon />}
          component={Link}
          href="/search"
          sx={{ color: getColorForPath('/search') }}
        />
        <BottomNavigationAction
          label="マップ"
          icon={<PlaceIcon />}
          component={Link}
          href="/map"
          sx={{ color: getColorForPath('/map') }}
        />
        <BottomNavigationAction
          label="お気に入り"
          icon={<FavoriteIcon />}
          component={Link}
          href="/favorite"
          sx={{ color: getColorForPath('/favorite') }}
        />
        <BottomNavigationAction
          label="マイページ"
          icon={<PersonIcon />}
          component={Link}
          href="/mypage"
          sx={{ color: getColorForPath('/mypage') }}
        />
      </BottomNavigation>
    </>

  )
}
