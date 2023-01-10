import { Box, CssBaseline } from "@mui/material"
import { Toaster } from "react-hot-toast";
import Board from "./components/Board"

function App() {

  return (
    <>
      <CssBaseline />
      <Box component='main' height='100%' px='130px'>
        <Board />
        <Toaster />
      </Box>
    </>
  )
}

export default App
