import { setAuthTokenGetter } from '@workspace/api-client-react';

// Initialize the API client to use our localStorage token
setAuthTokenGetter(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fruit_shop_token');
  }
  return null;
});

export const initApiAuth = () => {
  // Empty function just to ensure this file is imported and evaluated
};
