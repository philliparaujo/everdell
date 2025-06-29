import styled, { keyframes } from "styled-components";
import backgroundImage from "../assets/images/background.png";

// 1. Define the animation using keyframes
const panImage = keyframes`
  0% { background-position: 20% 0%; }
  12.5% { background-position: 80% 25%; }
  25% { background-position: 20% 50%; }
  37.5% { background-position: 80% 75%; }
  50% { background-position: 20% 100%; }
  62.5% { background-position: 80% 75%; }
  75% { background-position: 20% 50%; }
  87.5% { background-position: 80% 25%; }
  100% { background-position: 20% 0%; }
`;

// 2. Create a styled div that uses the animation and styles
const BackgroundContainer = styled.div`
  min-height: 100vh;

  background-image:
    linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.85)),
    url(${backgroundImage});
  background-size: 120%;
  background-repeat: no-repeat;
  animation: ${panImage} 400s linear infinite;
`;

export default BackgroundContainer;
