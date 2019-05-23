import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box, Text } from 'rebass';
import { Spinner, Pane, Badge } from 'evergreen-ui';
import {
  withScriptjs, withGoogleMap, GoogleMap, Marker,
} from 'react-google-maps';

import { getLocations } from '../lib/apiClient';

const renderDays = (openDays) => {
  const daysToIta = {
    mon: 'lun',
    tue: 'mar',
    wed: 'mer',
    thu: 'gio',
    fri: 'ven',
    sat: 'sab',
    sun: 'dom',
  };
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  return days.map(day => (
    <Badge isSolid marginRight={4} color={openDays[day] ? 'green' : 'red'}>
      {daysToIta[day]}
    </Badge>
  ));
};

const MapComponent = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap defaultZoom={7} defaultCenter={{ lat: 45.1, lng: 9 }}>
      {props.locations.map((location, i) => (
        <Marker
          key={location.id}
          label={String(i + 1)}
          position={{ lat: location.latitude, lng: location.longitude }}
        />
      ))}
    </GoogleMap>
  )),
);

const SelectLocation = ({ setSelectedLocation, selectedLocation }) => {
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  useEffect(() => {
    const req = async () => {
      try {
        const res = await getLocations();
        const json = await res.json();
        console.log(json);
        setLocations(json);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingLocations(false);
      }
    };
    req();
  }, []);
  if (loadingLocations) {
    return <Spinner />;
  }
  return (
    <Flex mx={-10} flexDirection="row">
      <Box width={[1, 1, 2 / 5]} style={{ height: '400px', overflowY: 'scroll' }} px={10}>
        {locations.map((location, i) => (
          <Pane
            onClick={() => setSelectedLocation(location)}
            style={{ cursor: 'pointer' }}
            key={location.id}
            background={selectedLocation.id === location.id ? '#DDEBF7' : 'tint1'}
            padding={16}
            marginBottom={4}
          >
            <Flex flexDirection="row" alignItems="center">
              <Box
                style={{
                  height: 26,
                  width: 26,
                  backgroundColor: '#e53935',
                  borderRadius: 13,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}
              >
                {i + 1}
              </Box>
              <Box>
                <Text marginBottom={1} fontSize={3}>
                  {location.name}
                </Text>
                <Text fontSize={1}>{location.city}</Text>
              </Box>
            </Flex>
            <Flex>
              <Box paddingTop={10}>{renderDays(location.openDays)}</Box>
            </Flex>
          </Pane>
        ))}
      </Box>
      <Box width={[1, 1, 3 / 5]} px={10}>
        <MapComponent
          locations={locations}
          selectedLocation={selectedLocation}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRQqF7wbUhM0yg_tbRmC0K3kH-pxNpW1g"
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '400px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
        />
      </Box>
    </Flex>
  );
};

SelectLocation.propTypes = {
  setSelectedLocation: PropTypes.func.isRequired,
  selectedLocation: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
};

SelectLocation.defaultProps = {
  selectedLocation: {},
};

export default SelectLocation;
