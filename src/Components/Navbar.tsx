import ClearIcon from "@mui/icons-material/Clear";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Navbar = () => {
  const localuserinfo = localStorage.getItem("userinfo");
  const userinfo = localuserinfo ? JSON.parse(localuserinfo) : null;
  const navigation = useNavigate();
  const searchParams = useSearchParams();

  const [searchTerms, setSearchTerms] = useState(
    searchParams[0].get("query") ?? ""
  );

  const localSearchHistory = localStorage.getItem("searchHistory");
  const localSearches = localSearchHistory
    ? JSON.parse(localSearchHistory)
    : null;

  const [searchHistory, setSearchHistory] = useState<
    {
      searchText: string;
      searchTime: number;
    }[]
  >(localSearches ?? []);

  const [isHistoryVisible, setisHistoryVisible] = useState(false);
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("userinfo");
    navigation("/login", { replace: true });
  };

  const handleSearch = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigation(`/?query=${searchTerms}`);

    const newHistory = {
      searchText: searchTerms,
      searchTime: new Date().getTime(),
    };
    if (searchTerms.length > 0) {
      setSearchHistory([...searchHistory, newHistory]);
      localStorage.setItem(
        "searchHistory",
        JSON.stringify([...searchHistory, newHistory])
      );
    }

    setisHistoryVisible(false);
  };

  const handleRemove = (time: number) => {
    const updateHistory = searchHistory.filter(
      (item) => item.searchTime !== time
    );
    setSearchHistory(updateHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updateHistory));
  };

  const isTabletSize = useMediaQuery("(max-width:768px)");
  const isMobileSize = useMediaQuery("(max-width:426px)");
  const isSmallMobileSize = useMediaQuery("(max-width:320px)");

  return (
    <Box
      display={location.pathname === "/login" ? "none" : "flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      bgcolor={"#ff742b"}
      padding={"10px"}
      color="white"
    >
      <Box display={"flex"} alignItems={"center"} gap={"10px"}>
        <Typography
          variant="h5"
          component="p"
          border={"1.5px solid white"}
          paddingX={"10px"}
        >
          H
        </Typography>
        {!isMobileSize ? (
          <Typography
            variant="body1"
            component="p"
            textTransform={"capitalize"}
          >
            Hi {userinfo ? userinfo?.username : "Guest"}
          </Typography>
        ) : null}
      </Box>

      <form onSubmit={handleSearch} style={{ position: "relative" }}>
        <Input
          type="search"
          ref={inputRef}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          sx={{
            width:
              isTabletSize && !isSmallMobileSize
                ? "200px"
                : isSmallMobileSize
                ? "150px"
                : "400px",
            background: "white",
            padding: "5px",
          }}
          onFocus={() => setisHistoryVisible(true)}
          placeholder="Search.."
          value={searchTerms}
          onChange={(e) => setSearchTerms(e.target.value)}
        />

        {searchHistory.length > 0 && isHistoryVisible && (
          <Box
            display={"flex"}
            flexDirection={"column"}
            bgcolor={"white"}
            position={"absolute"}
            top={"100%"}
            width={"100%"}
            boxShadow={"0 0 10px 1px #d9d9d9"}
            height={200}
            color={"black"}
            zIndex={5}
            overflow={"auto"}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              padding={"5px"}
              borderBottom={"1px solid gray"}
            >
              Search History
              <IconButton
                size="small"
                color="error"
                onClick={() => setisHistoryVisible(false)}
              >
                <ClearIcon />
              </IconButton>
            </Box>

            {searchHistory
              .sort((a, b) => b.searchTime - a.searchTime)
              .map((item, index) => (
                <Box
                  key={index}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  padding={"5px"}
                >
                  <Button
                    startIcon={<HistoryIcon />}
                    sx={{ textTransform: "capitalize" }}
                    size="small"
                    onClick={() => {
                      navigation(`/?query=${item.searchText}`);
                      setSearchTerms(item.searchText);
                      setisHistoryVisible(false);
                    }}
                  >
                    <Typography variant="body2" sx={{ cursor: "pointer" }}>
                      {item.searchText}
                    </Typography>
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(item.searchTime)}
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
              ))}
          </Box>
        )}
      </form>

      <Box display="flex" alignItems="center" gap="15px">
        {!isMobileSize ? (
          <Button
            variant="contained"
            size="small"
            onClick={handleLogout}
            endIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        ) : (
          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{ color: "white" }}
          >
            <LogoutIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
