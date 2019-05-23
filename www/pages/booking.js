import React, { useState, useEffect } from 'react';
import { Flex, Box } from 'rebass';
import Link from 'next/link';
import Router from 'next/router';
import DatePicker, { registerLocale } from 'react-datepicker';
import {
  getDay, addDays, isAfter, format,
} from 'date-fns';
import localeIt from 'date-fns/locale/it';
import {
  Button, TextInputField, Text, Spinner,
} from 'evergreen-ui';

import SelectLocation from '../components/SelectLocation';
import { getVoucher, confirmBooking } from '../lib/apiClient';
import Layout from '../components/layout';

// open days and at least 4 days before
const filterOpenDays = (openDays, d) => {
  const day = getDay(d);
  const arr = [
    openDays.sun,
    openDays.mon,
    openDays.tue,
    openDays.wed,
    openDays.thu,
    openDays.fri,
    openDays.sat,
  ];
  return arr[day] && isAfter(d, addDays(new Date(), 4));
};

const MakeReservation = () => {
  const [errorLoadingVoucher, setErrorLoadingVoucher] = useState(null);
  const [localeRegistered, setLocaleRegistered] = useState(false);
  const [data, setData] = useState(null);
  const [loadingVoucher, setLoadingVoucher] = useState(true);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [errorConfirm, setErrorConfirm] = useState(null);
  useEffect(() => {
    registerLocale('it', localeIt);
    setLocaleRegistered(true);
  }, []);
  useEffect(() => {
    const req = async () => {
      try {
        const voucherId = Router.query.id;
        const res = await getVoucher(voucherId);
        const json = await res.json();
        setData(json);
        setLoadingVoucher(false);
      } catch (err) {
        console.log(err);
        setLoadingVoucher(false);
        if (err.status === 404) {
          setErrorLoadingVoucher('Codice buono non trovato');
        } else {
          setErrorLoadingVoucher('Errore durante il caricamento');
        }
      }
    };
    if (!data) {
      req();
    }
  }, []);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [participantEmail, setParticipantEmail] = useState('');
  const [participantPhone, setParticipantPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    setSelectedDate(null);
  }, [selectedLocation]);
  if (loadingVoucher) {
    return (
      <Layout>
        <div>
          <Spinner />
        </div>
      </Layout>
    );
  }
  if (errorLoadingVoucher) {
    return (
      <Layout>
        <Text color="red">{errorLoadingVoucher}</Text>
        <div>
          <Link href="/redeem">
            <a href="/redeem">Riprova</a>
          </Link>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <Flex my={-20} flexDirection="column">
        <Box py={20} width={1}>
          <h3>Scegli la location</h3>
          <SelectLocation
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </Box>
        <Flex mx={-20} flexDirection="row">
          <Box px={20} width={1}>
            <h3>Data desiderata del lancio</h3>
            <DatePicker
              disabled={!selectedLocation.id || loadingConfirm}
              className="datepicker-custom"
              popperPlacement="top"
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              locale={localeRegistered && 'it'}
              dateFormat="dd/MM/yyyy"
              filterDate={day => filterOpenDays(selectedLocation.openDays, day)}
              placeholderText="Scegli un giorno"
            />
          </Box>
          <Box px={20} width={1}>
            <h3>Dati aggiuntivi</h3>
            <TextInputField
              onChange={e => setParticipantEmail(e.target.value)}
              value={participantEmail}
              label="Email"
              disabled={loadingConfirm}
            />
            <TextInputField
              onChange={e => setParticipantPhone(e.target.value)}
              value={participantPhone}
              label="Telefono"
              disabled={loadingConfirm}
            />
            <small>Ti contatteremo solo in caso di imprevisti</small>
          </Box>
        </Flex>
        <Box>
          <Button
            onClick={async () => {
              try {
                setLoadingConfirm(true);
                setErrorConfirm(null);
                const res = await confirmBooking(data.booking.id, {
                  LocationId: selectedLocation.id,
                  dateBooked: format(selectedDate, 'yyyy-MM-dd'),
                  participantEmail,
                  participantPhone,
                });
                if (res.ok) {
                  Router.push('/success_booking');
                } else {
                  setLoadingConfirm(false);
                  setErrorConfirm('Errore server riprova');
                }
              } catch (err) {
                setLoadingConfirm(false);
                setErrorConfirm('Errore server riprova');
              }
            }}
            disabled={!participantEmail || !participantPhone || !selectedDate}
            appearance="primary"
            height={38}
            isLoading={loadingConfirm}
          >
            Conferma Prenotazione
          </Button>
          <Text color="red">{errorConfirm}</Text>
        </Box>
      </Flex>
    </Layout>
  );
};

export default MakeReservation;
