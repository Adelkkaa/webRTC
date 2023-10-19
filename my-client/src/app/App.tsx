import { MainLayout } from "@/components/layouts/MainLayout";
import "./styles/globals.scss";
import { AppBar } from "@/shared/AppBar";
import { VideoPlayer } from "@/components/pages/MainPage/VideoPlayer";

function App() {
  return (
    <MainLayout>
      <AppBar />
      <VideoPlayer />
    </MainLayout>
  );
}

export default App;
