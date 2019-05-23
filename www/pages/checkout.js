import React, { Component } from 'react';
import Router from 'next/router';
import {
  Flex, Box, Image, Text,
} from 'rebass';
import { Button, TextInputField, RadioGroup } from 'evergreen-ui';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { createVoucher } from '../lib/apiClient';

const SKUs = {
  SILVER: 'sku_F21y8bbgq3YrXo',
  GOLD: 'sku_F21zGzMfJOcrl9',
  PLATINUM: 'sku_F21z9Xaarw6cfT',
};

class CheckoutPage extends Component {
  state = {
    buyerName: '',
    buyerSurname: '',
    buyerEmail: '',
    buyerPhone: '',
    participantName: '',
    participantSurname: '',
    participantEmail: '',
    boxType: null,
    paymentMethod: 'CC',
    stripe: null,
    loading: false,
  };

  componentDidMount() {
    if (window.Stripe) {
      this.setState({
        stripe: window.Stripe('pk_test_UMCA0qPNvXriNvN0lRn3mY3B'),
      });
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        this.setState({
          stripe: window.Stripe('pk_test_UMCA0qPNvXriNvN0lRn3mY3B'),
        });
      });
    }
  }

  redirectToCheckout = async (voucherId) => {
    const { boxType, buyerEmail, stripe } = this.state;
    const { error } = await stripe.redirectToCheckout({
      items: [{ sku: SKUs[boxType], quantity: 1 }],
      successUrl: `${window.location.origin}/success_cc`,
      cancelUrl: `${window.location.origin}`,
      customerEmail: buyerEmail,
      clientReferenceId: voucherId,
    });

    if (error) {
      console.warn('Error:', error);
    }
  };

  redirectToBank = () => {
    Router.push('/success_bank');
  };

  createVoucher = async () => {
    this.setState({ loading: true });
    const { paymentMethod } = this.state;
    try {
      const res = await createVoucher(this.state);
      const json = await res.json();
      const { id } = json;
      if (paymentMethod === 'CC') {
        this.redirectToCheckout(id);
        return;
      }
      if (paymentMethod === 'BANK') {
        this.redirectToBank();
      }
    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      buyerName,
      buyerSurname,
      buyerEmail,
      buyerPhone,
      participantName,
      participantSurname,
      boxType,
      paymentMethod,
      loading,
    } = this.state;
    return (
      <Layout>
        <SEO title="Checkout" keywords={['adrenaline']} />
        <form>
          <Flex py={10} flexWrap="wrap">
            <Box width={1}>
              <h3>Dati acquirente</h3>
              <Flex flexWrap="wrap" flexDirection="row" mx={-20}>
                <Box width={[1 / 2, 1 / 4]} px={20}>
                  <TextInputField
                    disabled={loading}
                    label="Nome"
                    value={buyerName}
                    onChange={e => this.setState({ buyerName: e.target.value })}
                  />
                </Box>
                <Box width={[1 / 2, 1 / 4]} px={20}>
                  <TextInputField
                    disabled={loading}
                    label="Cognome"
                    value={buyerSurname}
                    onChange={e => this.setState({ buyerSurname: e.target.value })}
                  />
                </Box>
                <Box width={[1 / 2, 1 / 4]} px={20}>
                  <TextInputField
                    disabled={loading}
                    label="Email"
                    value={buyerEmail}
                    onChange={e => this.setState({ buyerEmail: e.target.value })}
                  />
                </Box>
                <Box width={[1 / 2, 1 / 4]} px={20}>
                  <TextInputField
                    disabled={loading}
                    label="Telefono"
                    value={buyerPhone}
                    onChange={e => this.setState({ buyerPhone: e.target.value })}
                  />
                </Box>
              </Flex>
            </Box>
            <Box width={1}>
              <Flex flexWrap="wrap" flexDirection="row" mx={-20}>
                <Box width={[1, 1 / 2]} px={20}>
                  <h3>Dati partecipante</h3>
                  <Flex flexDirection="row" mx={-20}>
                    <Box width={1 / 2} px={20}>
                      <TextInputField
                        disabled={loading}
                        label="Nome"
                        value={participantName}
                        onChange={e => this.setState({ participantName: e.target.value })}
                      />
                    </Box>
                    <Box width={1 / 2} px={20}>
                      <TextInputField
                        disabled={loading}
                        label="Cognome"
                        value={participantSurname}
                        onChange={e => this.setState({ participantSurname: e.target.value })}
                      />
                    </Box>
                  </Flex>
                </Box>
                <Box width={[1, 1 / 2]} px={20}>
                  <h3>Pagamento</h3>
                  <RadioGroup
                    size={16}
                    value={paymentMethod}
                    options={[
                      {
                        label: 'Carte',
                        value: 'CC',
                      },
                      {
                        label: 'Bonifico Bancario',
                        value: 'BANK',
                      },
                    ]}
                    onChange={value => this.setState({ paymentMethod: value })}
                  />
                </Box>
              </Flex>
            </Box>
          </Flex>
          <Flex py={10} my={10} flexWrap="wrap">
            <Box width={1}>
              <h3>Scegli pacchetto</h3>
              <Flex flexDirection="row" flexWrap="wrap" justifyContent="center" alignItems="center">
                <Box
                  width={[1, 1 / 3, 1 / 3]}
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.setState({ boxType: 'SILVER' })}
                >
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <Text>
                      <input
                        style={{ marginRight: 10, marginBottom: 15 }}
                        type="radio"
                        value="SILVER"
                        checked={boxType === 'SILVER'}
                        onChange={e => this.setState({ boxType: e.target.value })}
                      />
                      {' '}
                      Silver 180€
                    </Text>
                    <Image width="120" alt="box silver" src="https://placehold.it/200x200" />
                  </Flex>
                </Box>
                <Box
                  width={[1, 1 / 3, 1 / 3]}
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.setState({ boxType: 'GOLD' })}
                >
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <Text>
                      <input
                        style={{ marginRight: 10, marginBottom: 15 }}
                        type="radio"
                        value="GOLD"
                        checked={boxType === 'GOLD'}
                        onChange={e => this.setState({ boxType: e.target.value })}
                      />
                      {' '}
                      Gold 180€
                    </Text>
                    <Image width="120" alt="box gold" src="https://placehold.it/200x200" />
                  </Flex>
                </Box>
                <Box
                  width={[1, 1 / 3, 1 / 3]}
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.setState({ boxType: 'PLATINUM' })}
                >
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <Text>
                      <input
                        style={{ marginRight: 10, marginBottom: 15 }}
                        type="radio"
                        value="PLATINUM"
                        checked={boxType === 'PLATINUM'}
                        onChange={e => this.setState({ boxType: e.target.value })}
                      />
                      {' '}
                      Platinum 180€
                    </Text>
                    <Image width="120" alt="box platinum" src="https://placehold.it/200x200" />
                  </Flex>
                </Box>
              </Flex>
            </Box>
            <Box px={20} width={[1, 1, 2 / 5]} />
          </Flex>
        </form>
        <div>
          <Button
            isLoading={loading}
            height={48}
            appearance="primary"
            onClick={this.createVoucher}
            disabled={!boxType}
          >
            Ordina
          </Button>
        </div>
      </Layout>
    );
  }
}

export default CheckoutPage;
