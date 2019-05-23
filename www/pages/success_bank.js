import React from 'react';
import Link from 'next/link';

import Layout from '../components/layout';
import SEO from '../components/seo';

const SecondPage = () => (
  <Layout>
    <SEO title="Page two" />
    <h1>Ordine creato</h1>
    <p>mettere qui istruzioni per fare pagamento e procedura</p>
    <Link href="/">
      <a href="/">Go back to the homepage</a>
    </Link>
  </Layout>
);

export default SecondPage;
