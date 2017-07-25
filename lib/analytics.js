import ReactGA from 'react-ga';

export const initGA = () => {
  console.log('GA init');
  ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID);
}

export const logPageView = () => {
  console.log(`Logging pageview for ${window.location.pathname}`);
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

export const logEvent = (category = '', action = '', label = '') => {
  if (category && action && label) {
    ReactGA.event({ category, action, label });
  }
}

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
}
