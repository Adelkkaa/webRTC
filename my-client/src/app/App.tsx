import { MainLayout } from "@/components/layouts/MainLayout";
import "./styles/globals.scss";
import { AppBar } from "@/shared/AppBar";
import { VideoPlayer } from "@/components/pages/MainPage/VideoPlayer";
import { Options } from "@/components/pages/MainPage/Options";
import { Notification } from "@/components/pages/MainPage/Notification";

function App() {
  return (
    <MainLayout>
      <AppBar />
      <VideoPlayer />
      <Options>
        <Notification />
      </Options>
    </MainLayout>
  );
}

export default App;
