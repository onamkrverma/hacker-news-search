import {
  Box,
  Button,
  Container,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigation = useNavigate();

  const handleLogin = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("userinfo", JSON.stringify({ username, password }));
    navigation("/");
  };

  return (
    <Container>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"100vh"}
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"20px"}
          flexDirection={"column"}
          boxShadow={"0 0 10px 3px #eeeeee"}
          padding={"20px"}
          minWidth={"300px"}
          maxWidth={"500px"}
          borderRadius={"10px"}
        >
          <Typography variant="h5" component={"p"}>
            Login to your account
          </Typography>
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <FormControl sx={{ gap: "10px" }} fullWidth>
              <TextField
                type="text"
                name="username"
                autoComplete="username"
                label="Username"
                variant="outlined"
                size="small"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                name="password"
                type="password"
                label="Password"
                autoComplete="current-password"
                variant="outlined"
                size="small"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                size="medium"
                sx={{ bgcolor: "#ff742b" }}
              >
                Submit
              </Button>
            </FormControl>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
