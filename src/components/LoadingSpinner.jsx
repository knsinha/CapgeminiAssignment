import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

/**
 * Spinner animation
 */
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

/**
 * Styled Components
 */
const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  min-height: 300px;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
`;

const Message = styled.p`
  margin-top: 20px;
  color: #666;
  font-size: 16px;
  font-weight: 600;
`;

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <SpinnerContainer>
      <Spinner />
      <Message>{message}</Message>
    </SpinnerContainer>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

LoadingSpinner.defaultProps = {
  message: 'Loading...',
};

export default LoadingSpinner;