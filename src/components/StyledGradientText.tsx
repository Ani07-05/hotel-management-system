import styled, { keyframes } from 'styled-components'

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const StyledGradientText = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s linear infinite;

  @media (min-width: 768px) {
    font-size: 4.5rem;
  }
`

export default StyledGradientText

