import React from 'react';
import PropTypes from 'prop-types';

import Header from './header';

const Layout = ({ children }) => (
  <>
    <Header siteTitle="Paracadutismo Regalo" />
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '0px 1.0875rem 1.45rem',
        paddingTop: 0,
      }}
    >
      <main>{children}</main>
    </div>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
