import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';

export const Footer = () => {
  return (
    <>
      <BottomNavigation
        showLabels
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#EAC6AA"
        }}
        className='bg-blue-500'
      >
        <BottomNavigationAction
          label="ホーム"
          icon={<HomeIcon />}
          component={Link}
          href="/"
          sx={{ color: "#5F8E63" }}
        />
        <BottomNavigationAction
          label="検索"
          icon={<SearchIcon />}
          component={Link}
          href="/search"
          sx={{ color: "#83BC87" }}
        />
        <BottomNavigationAction
          label="マップ"
          icon={<PlaceIcon />}
          component={Link}
          href="/map"
          sx={{ color: "#83BC87" }}
        />
        <BottomNavigationAction
          label="お気に入り"
          icon={<FavoriteIcon />}
          component={Link}
          href="/favorite"
          sx={{ color: "#83BC87" }}
        />
        <BottomNavigationAction
          label="マイページ"
          icon={<PersonIcon />}
          component={Link}
          href="/mypage"
          sx={{ color: "#83BC87" }}
        />
      </BottomNavigation>
    </>

  )
}
