import fetch from 'isomorphic-unfetch';

export async function createVoucher(data) {
  return fetch('/api/vouchers', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function confirmBooking(bookingId, data) {
  return fetch(`/api/bookings?id=${bookingId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function getVoucher(id) {
  return fetch(`/api/vouchers?id=${id}`);
}

export async function getLocations() {
  return fetch('/api/locations');
}
