import React from 'react';
import Link from 'next/link';
import Layout from '../components/layout';

const HomePage = () => (
  <Layout>
    <div>
      <Link href="/checkout">
        <a href="/checkout">Pacchetti</a>
      </Link>
    </div>
    <div>
      <Link href="/redeem">
        <a href="/checkout">Redeem</a>
      </Link>
    </div>
  </Layout>
);

export default HomePage;
