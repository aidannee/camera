import Profile from "./components/Profile";
import "./App.css";

function App() {
  return (
    <>
      <div
        draggable="false"
        className="h-[100vh-7rem] md:h-screen w-screen md:pb-0 overflow-hidden"
      >
        {" "}
        <Profile />
      </div>
    </>
  );
}
export default App;
