import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoryRes } from "../utils/apiResults";

const Story = () => {
  const [storyInfo, setStoryInfo] = useState<StoryRes | null>(null);
  const searchParams = useSearchParams();
  const itemId = searchParams[0].get("item") ?? "";
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getStory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://hn.algolia.com/api/v1/items/${itemId}`);
      const data = await res.json();
      setStoryInfo(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStory();
  }, [itemId]);

  return (
    <Container>
      <Box marginY={"10px"}>
        <IconButton size="medium" onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        {!isLoading ? (
          <>
            <Typography variant="h5" component={"h1"}>
              {storyInfo?.title}
            </Typography>
            {storyInfo?.url && (
              <a
                href={storyInfo?.url}
                target="_blank"
                style={{
                  textDecoration: "none",
                  color: "gray",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  maxWidth: "500px",
                  fontSize: 14,
                }}
              >
                ({storyInfo.url})
              </a>
            )}
            <Typography variant="body1" component={"p"}>
              Comments of Users
            </Typography>
          </>
        ) : (
          <>
            <Skeleton variant="text" sx={{ fontSize: "3rem" }} />
            <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={150} />
          </>
        )}
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            padding: 0,
          }}
        >
          {!isLoading ? (
            storyInfo?.children.map((item, index) => (
              <ListItem
                key={item.id}
                sx={{
                  display: "flex",
                  gap: "2px",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  color: "#444444",
                  overflow: "hidden",
                }}
              >
                <Box>
                  {`${index + 1}.)`} {item.text}
                </Box>
                <Typography
                  variant="body2"
                  component={"p"}
                  sx={{ color: "gray" }}
                  fontSize={12}
                >
                  Commented By: {item.author} |{" "}
                  {new Date(item.created_at).toDateString()}
                </Typography>
              </ListItem>
            ))
          ) : (
            <Box>
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      gap: "2px",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      color: "#444444",
                      overflow: "hidden",
                    }}
                  >
                    <Skeleton
                      key={index}
                      variant="text"
                      sx={{ fontSize: "2rem" }}
                      width={300}
                      height={50}
                    />
                    <Skeleton variant="text" width={100} />
                  </ListItem>
                ))}
            </Box>
          )}
        </List>
      </Box>
    </Container>
  );
};

export default Story;
