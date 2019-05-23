module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    booked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dateBooked: DataTypes.DATEONLY,
    notes: DataTypes.STRING(1024),
    participantName: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    participantSurname: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    participantEmail: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    participantPhone: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    // VoucherId
    // LocationId
  });

  return Booking;
};
