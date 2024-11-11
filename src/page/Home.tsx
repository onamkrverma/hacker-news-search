import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SearchResults } from "../utils/apiResults";

const Home = () => {
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null
  );
  const [searchParams, setSearchParms] = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    tag: "story",
    sortBy: "popularity",
    timeFrame: "",
    page: 0,
  });
  const [dateRange, setDateRange] = useState(0);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const getSearchResults = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://hn.algolia.com/api/v1/${
          filter.sortBy === "date" ? "search_by_date" : "search"
        }?query=${query}&tags=${filter.tag}&page=${
          filter.page
        }&numericFilters=${
          dateRange > 0 &&
          !customDateRange.startDate &&
          !customDateRange.endDate
            ? `created_at_i>${dateRange.toString().slice(0, 10)}`
            : customDateRange.startDate && customDateRange.endDate
            ? `created_at_i>${new Date(customDateRange.startDate)
                .getTime()
                .toString()
                .slice(0, 10)},created_at_i<${new Date(customDateRange.endDate)
                .getTime()
                .toString()
                .slice(0, 10)}`
            : ""
        }`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (filter.timeFrame === "custom") return;
    getSearchResults();
    searchParams.set("tag", filter.tag),
      searchParams.set("sortby", filter.sortBy),
      searchParams.set("date-range", filter.timeFrame),
      searchParams.set("page", (filter.page + 1).toString()),
      setSearchParms(searchParams);
  }, [query, filter, dateRange]);

  const now = new Date().getTime();
  const last24Hours = now - 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const pastWeek = now - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const pastMonth = now - 30 * 24 * 60 * 60 * 1000; // Approx. 30 days in milliseconds
  const pastYear = now - 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds

  useEffect(() => {
    switch (filter.timeFrame) {
      case "last24Hours":
        setDateRange(last24Hours);
        break;
      case "pastWeek":
        setDateRange(pastWeek);
        break;
      case "pastMonth":
        setDateRange(pastMonth);
        break;
      case "pastYear":
        setDateRange(pastYear);
        break;
      default:
        setDateRange(0);
        break;
    }
  }, [filter.timeFrame]);

  const handleCustomRange = () => {
    getSearchResults();
    searchParams.set("start-date", customDateRange.startDate);
    searchParams.set("end-date", customDateRange.endDate);
    setSearchParms(searchParams);
  };

  const isSmallLaptopSize = useMediaQuery("(max-width:1024px)");
  const isMobileSize = useMediaQuery("(max-width:426px)");

  return (
    <Container>
      <Box
        display={"flex"}
        alignItems={"center"}
        gap={"10px"}
        flexWrap={"wrap"}
        marginY={"15px"}
        position={"relative"}
      >
        Search
        <Select
          defaultValue={"story"}
          onChange={(e) =>
            setFilter({
              ...filter,
              tag: e.target.value !== "all" ? e.target.value : "",
            })
          }
          size="small"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value={"story"}>Story</MenuItem>
          <MenuItem value={"comment"}>Comment</MenuItem>
          <MenuItem value={"ask_hn"}>Ask HN</MenuItem>
          <MenuItem value={"show_hn"}>Show HN</MenuItem>
          <MenuItem value={"poll"}>Poll</MenuItem>
        </Select>
        by
        <Select
          defaultValue={"popularity"}
          onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
          size="small"
        >
          <MenuItem value={"date"}>Date</MenuItem>
          <MenuItem value={"popularity"}>Popularity</MenuItem>
        </Select>
        for
        <Select
          defaultValue={"allTime"}
          onChange={(e) => setFilter({ ...filter, timeFrame: e.target.value })}
          size="small"
        >
          <MenuItem value="allTime">All time</MenuItem>
          <MenuItem value={"last24Hours"}>last 24h</MenuItem>
          <MenuItem value={"pastWeek"}>Past Week</MenuItem>
          <MenuItem value={"pastMonth"}>Past Month</MenuItem>
          <MenuItem value={"pastYear"}>Past Year</MenuItem>
          <MenuItem value={"custom"}>Custom range</MenuItem>
        </Select>
        {filter.timeFrame === "custom" && (
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={"10px"}
            flexWrap={"wrap"}
          >
            <TextField
              label="Start Date"
              type="date"
              placeholder="start_date"
              onChange={(e) =>
                setCustomDateRange({
                  ...customDateRange,
                  startDate: e.currentTarget.value,
                })
              }
              size="small"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <TextField
              label="End Date"
              type="date"
              placeholder="end_date"
              onChange={(e) =>
                setCustomDateRange({
                  ...customDateRange,
                  endDate: e.currentTarget.value,
                })
              }
              size="small"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleCustomRange}
            >
              Apply
            </Button>
          </Box>
        )}
        {!isSmallLaptopSize && !isLoading && (
          <Typography
            variant="body2"
            component="p"
            color="gray"
            position={"absolute"}
            top={"10px"}
            right={0}
          >
            {searchResults?.nbHits} Results (
            {searchResults && searchResults?.processingTimeMS / 1000} seconds)
          </Typography>
        )}
      </Box>
      <Box>
        <List sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {!isLoading
            ? searchResults?.hits.map((item) => (
                <ListItem
                  key={item.objectID}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    alignItems: "flex-start",
                    padding: "0",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    columnGap="5px"
                    flexWrap={"wrap"}
                  >
                    <Link
                      to={`/story?item=${item.story_id}`}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        maxWidth: isMobileSize ? "200px" : "500px",
                      }}
                    >
                      {item.title ?? item.story_title ?? item.story_text}
                    </Link>
                    <a
                      href={item.url ?? item.story_url}
                      target="_blank"
                      style={{
                        textDecoration: "none",
                        color: "gray",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        maxWidth: isMobileSize ? "200px" : "500px",
                      }}
                    >
                      ({item.url ?? item.story_url})
                    </a>
                  </Box>
                  <Typography
                    variant="body2"
                    component={"p"}
                    sx={{ color: "gray" }}
                    fontSize={12}
                  >
                    {item.points} points | {item.author} |{" "}
                    {new Date(item.created_at).toDateString()} |{" "}
                    {item.num_comments}
                    comments
                  </Typography>
                </ListItem>
              ))
            : Array(10)
                .fill(0)
                .map((_, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      alignItems: "flex-start",
                      padding: "0",
                    }}
                  >
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "2rem" }}
                      width={400}
                    />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      width={200}
                    />
                  </ListItem>
                ))}
        </List>
      </Box>
      {!isLoading && (
        <Box display={"flex"} justifyContent={"center"} marginY={"10px"}>
          <Pagination
            count={10}
            variant="outlined"
            shape="rounded"
            onChange={(_, page) => setFilter({ ...filter, page: page - 1 })}
          />
        </Box>
      )}
    </Container>
  );
};

export default Home;
