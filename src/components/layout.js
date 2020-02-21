/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import { useAuth } from 'react-use-auth';

import Header from './header';
import Nav from './nav';
import './layout.css';

const loadAuthenticatedApp = () => import('../components/authenticated-app');
const AuthenticatedApp = React.lazy(loadAuthenticatedApp);
const UnauthenticatedApp = React.lazy(() =>
  import('../components/unauthenticated-app')
);

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  // pre-load the authenticated side in the background while the user's
  // filling out the login form.
  React.useEffect(() => {
    loadAuthenticatedApp();
  }, []);

  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <React.Suspense fallback={<>{/* spinner */}</>}>
        {isAuthenticated() && <h1>Hi {user.email}</h1> ? (
          <AuthenticatedApp />
        ) : (
          <UnauthenticatedApp />
        )}
      </React.Suspense>
      <Header siteTitle={data.site.siteMetadata.title} />
      <Nav />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
