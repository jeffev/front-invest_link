import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Logo from "../assets/LOGO.png";
import Container from "@mui/material/Container";
import authService from "../services/auth.service";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { Alert, Backdrop } from "@mui/material";

export default function Register() {
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const nome = data.get("firstName");
    const sobrenome = data.get("lastName");
    const usuario = data.get("user");
    const senha = data.get("password");

    try {
      const response = await authService.register(
        nome,
        sobrenome,
        usuario,
        email,
        senha
      );

      if (response.ok) {
        setError("");

        setLoading(false);
        navigate("/home");
      } else {
        const error = await response.text();
        setError(error);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setError("Error!!!");
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={Logo} style={{ width: "170px", height: "170px" }} />

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="Nome"
                variant="standard"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Sobrenome"
                name="lastName"
                variant="standard"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="user"
                label="Usuário"
                name="user"
                variant="standard"
                autoComplete="user"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                variant="standard"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="standard"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Criar
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Já possui uma conta? Entrar
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
