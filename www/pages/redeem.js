import React, { useState } from 'react';
import { Flex, Box } from 'rebass';
import Router from 'next/router';
import { Button, TextInputField } from 'evergreen-ui';
import Layout from '../components/layout';

import { getVoucher } from '../lib/apiClient';

const RedeemPage = () => {
  const [id, setId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  return (
    <Layout>
      <Flex flexWrap="wrap">
        <Box width={1}>
          <h3>Registrazione buono</h3>
        </Box>
        <Box width={320}>
          <TextInputField
            label="Codice"
            style={{ textAlign: 'center' }}
            inputWidth={134}
            maxLength={10}
            inputHeight={42}
            value={id}
            onChange={e => setId(e.target.value)}
          />
          <Button
            isLoading={isLoading}
            disabled={isLoading}
            onClick={async () => {
              try {
                setIsLoading(true);
                setError(null);
                const res = await getVoucher(id);
                const json = await res.json();
                if (json.voucher.status === 'PAID') {
                  Router.push(`/booking?id=${id}`);
                } else {
                  setIsLoading(false);
                  setError(
                    "Il pagamento di questo buono non e' stato ricevuto",
                  );
                }
              } catch (err) {
                setIsLoading(false);
                if (err.status === 404) {
                  setError('Codice buono non trovato');
                } else {
                  setError('Errore del server riprovare');
                }
              }
            }}
            height={42}
            appearance="primary"
          >
            Controlla
          </Button>
          {error && <div style={{ marginTop: 20, color: 'red' }}>{error}</div>}
        </Box>
      </Flex>
    </Layout>
  );
};

export default RedeemPage;
